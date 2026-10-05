from PIL import Image
import numpy as np
from scipy import ndimage as ndi
# Inputs: the three "Every page has been considered-*" files from public/images/icons (copied/renamed).
# Outputs: public/images/features/<name>.png (transparent, light) and <name>-night.png (cool paper disc, dark).
C={'short-stories':('short-stories.jpg',513.9,516.3,444.1),'companion':('companion.jpg',624.2,616.3,586.0),'wander':('wander.png',623.7,619.5,595.1)}
CLOSE={'short-stories':0,'companion':8,'wander':8}   # the book's page tips need a wider bridge
OUT=640           # output px (square); ring outer radius lands at 0.92*OUT/2 for all three
RING_FRAC=0.92
def unmul(a,al):
    return np.clip(np.where(al[...,None]>0,255-(255-a)/np.maximum(al[...,None],1e-6),0),0,255)
res={}
for name,(f,cx,cy,R) in C.items():
    a=np.asarray(Image.open(f).convert('RGB')).astype(np.float32); H,W,_=a.shape
    yy,xx=np.mgrid[0:H,0:W]; dd=np.hypot(xx-cx,yy-cy)
    c2a=(255-a).max(2)/255
    disk=dd<R-24
    st=ndi.gaussian_filter(255-a.min(2),1.5)          # smoothed ink strength
    noise=np.percentile(st[(dd>R+40)&(st<20)],99.5)    # paper grain outside the ring (ignores art that breaks out)
    thr=max(1.5,noise+1.0)
    raw=(st>thr)&disk
    lab,n=ndi.label(raw); sz=ndi.sum(raw,lab,np.arange(1,n+1))
    raw=np.isin(lab,1+np.where(sz>=1500)[0])           # the art itself, not paper grain
    if CLOSE[name]:
        m=ndi.binary_closing(raw,structure=ndi.iterate_structure(ndi.generate_binary_structure(2,1),CLOSE[name]))
    else:
        # The book's fanned pages fade to pure white with no drawn top edge, so nothing encloses them.
        # Close with a large disc (r=42) on a half-size mask: it bridges the page tips and fills the pages.
        sm=ndi.zoom(raw.astype(np.float32),0.5,order=1)>0.5
        r=21; yy2,xx2=np.mgrid[-r:r+1,-r:r+1]; disc=(xx2**2+yy2**2)<=r*r
        sm=np.pad(sm,r+1); sm=ndi.binary_closing(sm,structure=disc)[r+1:-r-1,r+1:-r-1]
        m=(ndi.zoom(sm.astype(np.float32),2,order=1)[:H,:W]>0.5)|raw
    holes=ndi.binary_fill_holes(m)&~m
    lab,n=ndi.label(holes); sz=ndi.sum(holes,lab,np.arange(1,n+1))
    holes=np.isin(lab,1+np.where(sz>=150)[0])          # enclosed white areas (book pages)
    enclosed=ndi.gaussian_filter((m&~raw|holes).astype(np.float32),1.0)   # bridged gaps + enclosed holes -> opaque
    if not CLOSE[name]:
        enclosed=ndi.gaussian_filter((ndi.binary_erosion(m|holes,iterations=1)).astype(np.float32),1.2)   # the whole book is solid paper
    solid=np.clip((st-thr)/6,0,1)*disk                 # pale wash fades in over ~6 levels instead of a hard cut
    print(name,'noise',round(noise,2),'thr',round(thr,2))
    al_light=np.clip(np.maximum.reduce([c2a,enclosed,solid]),0,1); al_light[al_light<0.015]=0
    rgb_l=unmul(a,al_light)
    # disc version: paper kept inside the ring's outer edge (feathered), art outside the ring via c2a
    discm=np.clip((R+5-dd)/3.0+0.5,0,1)   # the whole painted ring sits on the paper
    al_disc=np.maximum(discm,al_light)
    rgb_d=np.where(discm[...,None]>=al_light[...,None],a,rgb_l)
    rgb_d=rgb_d*np.array([0xEE,0xF4,0xF7])/255   # paper cooled a touch (#EEF4F7) so it sits on deep-sea without glare
    # crop square around ring centre, scale so R -> RING_FRAC*OUT/2
    half=R/RING_FRAC
    box=(cx-half,cy-half,cx+half,cy+half)
    for tag,rgb,al in (('light',rgb_l,al_light),('disc',rgb_d,al_disc)):
        im=Image.fromarray(np.dstack([rgb,al*255]).round().astype(np.uint8),'RGBA')
        # pad if box exceeds canvas
        P=int(max(0,-box[0],-box[1],box[2]-W,box[3]-H))+2
        if P>2:
            big=Image.new('RGBA',(W+2*P,H+2*P),(0,0,0,0)); big.paste(im,(P,P)); im=big; b=(box[0]+P,box[1]+P,box[2]+P,box[3]+P)
        else: b=box
        im=im.resize((OUT,OUT),Image.LANCZOS,box=b)
        im.save(f'{name}-{tag}.png',optimize=True); res[(name,tag)]=im
    print(name,'pad',P)
# previews
def sheet(tag,bg,fn):
    c=Image.new('RGB',(OUT*3,OUT),bg)
    for i,n in enumerate(['short-stories','companion','wander']):
        im=res[(n,tag)]; c.paste(im,(i*OUT,0),im)
    c.resize((OUT*3//2,OUT//2)).save(fn)
sheet('light',(0x9B,0xBA,0xBF),'pv-light-misty.png')
sheet('light',(3,68,106),'pv-light-deep.png')
sheet('disc',(3,68,106),'pv-disc-deep.png')
