"""Telephone (TSM Website Pdf p.7) -> transparent light + deep-sea night PNGs."""
from PIL import Image
import numpy as np
from scipy import ndimage as ndi
a=np.asarray(Image.open('/mnt/user-data/uploads/TheStoenMind/design/content-source/contact-telephone-original.png').convert('RGB')).astype(np.float32)
ink=(255-a.min(axis=2))>12
lab,n=ndi.label(~ink); idx=np.arange(1,n+1)
sizes=ndi.sum(np.ones_like(lab),lab,idx); means=ndi.mean(a.min(axis=2),lab,idx)
outer=lab[0,0]
paper_ids=[i for i,s,m in zip(idx,sizes,means) if i==outer or (m>=249 and s>=8)]
paper=np.isin(lab,paper_ids)
shape=~paper
core=ndi.binary_erosion(shape,iterations=3)
core=ndi.gaussian_filter(core.astype(np.float32),1.6)
c2a=(255-a).max(axis=2)/255
alpha=np.clip(np.maximum(core,c2a),0,1); alpha[alpha<0.02]=0
rgb=np.clip(np.where(alpha[...,None]>0,255-(255-a)/np.maximum(alpha[...,None],1e-6),0),0,255)
out=np.dstack([rgb,alpha*255]).round().astype(np.uint8)
ys,xs=np.where(alpha>0.02); P=12
box=(max(xs.min()-P,0),max(ys.min()-P,0),min(xs.max()+P+1,a.shape[1]),min(ys.max()+P+1,a.shape[0]))
light=Image.fromarray(out,'RGBA').crop(box); light.save('telephone.png',optimize=True)
stops=[(0,(0x04,0x22,0x3A)),(.25,(0x14,0x54,0x7A)),(.5,(0x46,0x82,0xAA)),(.75,(0x96,0xBC,0xD4)),(1,(0xE8,0xF1,0xF7))]
L=np.asarray(light).astype(np.float32)
lum=((0.2126*L[...,0]+0.7152*L[...,1]+0.0722*L[...,2])/255)**1.15
pos=[s[0] for s in stops]
night=np.dstack([np.interp(lum,pos,[s[1][c] for s in stops]) for c in range(3)]+[L[...,3]]).round().astype(np.uint8)
Image.fromarray(night,'RGBA').save('telephone-night.png',optimize=True)
W,H=light.size; nt=Image.open('telephone-night.png')
c=Image.new('RGB',(W*3,H))
for i,(bg,img) in enumerate([((255,255,255),light),((3,68,106),light),((3,68,106),nt)]):
    c.paste(Image.new('RGB',(W,H),bg),(i*W,0)); c.paste(img,(i*W,0),img)
c.save('prev.png'); print(light.size,box)
