# Oct 12: Nancy's new feature icons (Drive "3. Content & Assets": Icon- Quiet Companion / Short Stories / Space to wander)
# -> public/images/features/<name>.png (transparent, light) and <name>-night.png (cool paper disc, dark).
# Quiet Companion + Short Stories are JPEGs on white paper: the white is removed (colour-to-alpha), painted
# areas are kept solid, and white enclosed by the drawing (shirts, dresses) is filled so it stays opaque.
# The ring itself is left out of the hole-filling so the sky inside it turns transparent.
# Space to wander arrives as a transparent PNG and is only re-framed.
from PIL import Image
import numpy as np
from scipy import ndimage as ndi
SRC={'companion':('Icon- Quiet Companion.jpg',619.8,624.3,578.4),
     'short-stories':('Icon- Short Stories.jpg',626.6,616.8,603.7),
     'wander':('Icon- Space to wander.png',627.2,627.4,604.2)}
OUT=640; RING_FRAC=0.92; PAPER=np.array([0xEE,0xF4,0xF7])/255
def unmul(a,al):
    return np.clip(np.where(al[...,None]>0,255-(255-a)/np.maximum(al[...,None],1e-6),0),0,255)
res={}
for name,(f,cx,cy,R) in SRC.items():
    im=Image.open(f).convert('RGBA'); A=np.asarray(im).astype(np.float32); H,W,_=A.shape
    yy,xx=np.mgrid[0:H,0:W]; dd=np.hypot(xx-cx,yy-cy)
    if f.endswith('.png'):
        al_light=A[...,3]/255; rgb_l=A[...,:3]
    else:
        a=A[...,:3]
        c2a=(255-a).max(2)/255
        st=ndi.gaussian_filter(255-a.min(2),1.5)
        noise=np.percentile(st[(dd>R+30)],99.5); thr=max(3,noise+2)
        raw=st>thr
        lab,n=ndi.label(raw); sz=ndi.sum(raw,lab,np.arange(1,n+1)); raw=np.isin(lab,1+np.where(sz>=800)[0])
        inner=raw&(dd<R-28)                    # the drawing without the ring
        m=ndi.binary_closing(inner,structure=ndi.iterate_structure(ndi.generate_binary_structure(2,1),4))
        holes=ndi.binary_fill_holes(m)&~m
        lab,n=ndi.label(holes); sz=ndi.sum(holes,lab,np.arange(1,n+1))
        holes=np.isin(lab,1+np.where((sz>=60)&(sz<60000))[0])   # enclosed whites (not the open sky)
        enclosed=ndi.gaussian_filter(((m&~raw)|holes).astype(np.float32),1.0)
        solid=np.clip((st-thr)/8,0,1)
        al_light=np.clip(np.maximum.reduce([c2a,enclosed,solid]),0,1); al_light[al_light<0.02]=0
        rgb_l=unmul(a,al_light)
        print(name,'noise',round(float(noise),2),'thr',round(float(thr),2),'holes',int(holes.sum()))
    # night: paper disc filling the ring, art outside the ring kept from the light cut
    discm=np.clip((R+4-dd)/3.0+0.5,0,1)
    al_disc=np.maximum(discm,al_light)
    over=rgb_l*al_light[...,None]+255*(1-al_light[...,None])          # art over white paper
    rgb_d=np.where(discm[...,None]>=al_light[...,None],over,rgb_l)*PAPER
    half=R/RING_FRAC; box=(cx-half,cy-half,cx+half,cy+half)
    for tag,rgb,al in (('light',rgb_l,al_light),('night',rgb_d,al_disc)):
        img=Image.fromarray(np.dstack([rgb,al*255]).round().clip(0,255).astype(np.uint8),'RGBA')
        P=int(max(0,-box[0],-box[1],box[2]-W,box[3]-H))+2
        big=Image.new('RGBA',(W+2*P,H+2*P),(0,0,0,0)); big.paste(img,(P,P))
        img=big.resize((OUT,OUT),Image.LANCZOS,box=(box[0]+P,box[1]+P,box[2]+P,box[3]+P))
        fn=f'{name}.png' if tag=='light' else f'{name}-night.png'
        img.save('out/'+fn,optimize=True); res[(name,tag)]=img
def sheet(tag,bg,fn):
    c=Image.new('RGB',(OUT*3,OUT),bg)
    for i,n in enumerate(['short-stories','companion','wander']):
        im=res[(n,tag)]; c.paste(im,(i*OUT,0),im)
    c.resize((OUT*3//2,OUT//2)).save(fn)
sheet('light',(200,60,60),'pv-light-red.png')
sheet('light',(0x9B,0xBA,0xBF),'pv-light-misty.png')
sheet('night',(3,68,106),'pv-night-deep.png')
