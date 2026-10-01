# -*- coding: utf-8 -*-
import re, json
src=open('/home/claude/emc/study.html',encoding='utf-8').read()
F=json.load(open('/home/claude/emc2/figs.json',encoding='utf-8'))
def rd(n): return open('/home/claude/emc2/'+n,encoding='utf-8').read()
def sub_figs(s):
    for k,v in F.items(): s=s.replace('{{'+k+'}}',v)
    return s
def section(sid):
    m=re.search(r'<section id="%s">.*?</section>'%sid,src,re.S)
    assert m, sid
    return m.group(0)

# ---------- head: title + fonts + style (+ additions) ----------
head=src[:src.index('</style>')]
css_add='''
/* ---------- 개정판 추가 ---------- */
.new{display:inline-block;font-family:var(--mono);font-size:10.5px;letter-spacing:.06em;line-height:1.5;color:var(--light);border:1px solid var(--light);border-radius:2px;padding:0 6px;margin-left:8px;vertical-align:.2em;font-weight:500;white-space:nowrap;text-transform:none}
.note.l{background:var(--lightw);border-color:var(--light)}
.note.l b{color:var(--light)}
.formulas{display:flex;flex-wrap:wrap;gap:12px;align-items:stretch}
.formulas .formula-hero{min-width:0;max-width:100%}
.formula-hero small{display:block;font-family:var(--sans);font-size:12.5px;color:var(--ink2);margin-top:5px;letter-spacing:0}
.question{font-family:var(--serif);font-weight:700;font-size:clamp(19px,3.8vw,24px);line-height:1.5;color:var(--light);border-top:1px solid var(--light);border-bottom:1px solid var(--light);padding:18px 0;margin:22px 0;text-wrap:balance}
table.mx td:not(:first-child),table.mx th:not(:first-child){text-align:center}
table.mx td.gone{color:var(--light);font-weight:500}
table.mx td.none{color:var(--ink3)}
.qa .q>span{min-width:0}
.day{grid-template-columns:96px 1fr}
thead th{text-transform:none;letter-spacing:.02em}
'''
out=head+css_add+'</style>\n\n'

# ---------- hero + nav + s0 ----------
out+=sub_figs(rd('blk_top.html'))+'\n'

# ---------- s1 (unchanged) ----------
out+=section('s1')+'\n\n'

# ---------- s1b: replace final check note with 1.7/1.8 + new note ----------
s1b=section('s1b')
i=s1b.index('<div class="note w">\n      <span class="tagline">여기까지 이해했는지 확인</span>')
j=s1b.index('</div>',i)+len('</div>')
s1b=s1b[:i]+sub_figs(rd('blk_s1add.html')).strip()+s1b[j:]
out+=s1b+'\n\n'

# ---------- s2 edits ----------
s2=section('s2')
anchor='<p class="sub">축전기 담당자용. 이 파트의 핵심은 "왜 한 번만 재면 안 되는가"이고, 그 답이 곧 분석 방법이다.</p>'
assert anchor in s2
s2=s2.replace(anchor, '<p class="sub">축전기 담당자용. 이 파트에서 가장 중요한 질문은 "왜 한 번만 재면 안 되는가"이고, 그 답이 곧 분석 방법이다.</p>\n    <div class="note l">\n      <span class="tagline">개정판에서 바뀐 점</span>\n      이 축전기는 실험 C에서도 그대로 쓴다. 간격을 하나 맞출 때마다 <b>실험 A(멀티미터)와 실험 C(공진 진동수)를 연달아</b> 잰다. 판과 누름돌은 건드리지 않고 집게만 바꿔 문다. 절차는 4.5절에 있다.\n    </div>')
old_steps=s2[s2.index('<h3>2.4 절차</h3>'):s2.index('<h3>2.5 예상 데이터</h3>')]
new_steps='''<h3>2.4 절차</h3>
    <ol class="chain">
      <li>판을 떼어 놓은 상태에서 <strong>리드선만의 용량을 먼저 잰다.</strong><span class="eqi">이 값이 나중에 나올 절편 C₀와 비슷해야 정상이다</span></li>
      <li>아래 판을 책상에 놓고, 모서리 네 곳과 가운데에 같은 두께의 스페이서를 올린다.</li>
      <li>위 판을 얹고 책으로 누른다. 도체면이 서로 마주 보게 놓았는지 확인한다.</li>
      <li><strong>네 모서리에서 각각 d를 캘리퍼스로 재서 평균한다.</strong><span class="eqi">한 곳만 재면 판이 기울어진 것을 놓친다</span></li>
      <li>정전용량을 3회 이상 재서 평균한다. 손을 판에 가까이 대면 값이 흔들리므로 읽는 동안 떨어져 있는다.</li>
      <li>실험 C를 함께 하는 날에는 여기서 멀티미터 집게를 떼고 LC 회로를 물려 공진 진동수를 잰다(4.5절).</li>
      <li>스페이서를 바꿔 d를 1 &#8594; 1.5 &#8594; 2 &#8594; 3 &#8594; 4 &#8594; 5 mm로 올리며 4~6단계를 반복한다.</li>
      <li>d를 다시 1 mm로 되돌려 첫 측정값이 재현되는지 확인한다.<span class="eqi">재현되지 않으면 리드선이 움직였거나 판이 휘었다</span></li>
    </ol>

    '''
s2=s2.replace(old_steps,new_steps)
old_weak='어느 쪽이든 절대 교정이 어딘가에는 필요하다는 점을 발표에서 솔직히 밝히는 편이 좋다.'
assert old_weak in s2
s2=s2.replace(old_weak,'어느 쪽이든 절대 교정이 어딘가에는 필요하다는 점을 발표에서 밝히는 편이 좋다. 실험 C는 이 교정 문제를 비켜 가는 방법이다.')
s2=s2.replace('오른쪽에서 절편을 그냥 버리는 것이 이 실험의 핵심 기법이고, 발표에서 반드시 설명해야 하는 부분이다.','오른쪽처럼 절편을 그냥 버리는 것이 이 실험의 요령이고, 발표에서 반드시 설명해야 하는 부분이다.')
out+=s2+'\n\n'

# ---------- s3 edits ----------
s3=section('s3')
old_row='<tr><td>폰 센서 자체 오차</td><td>기종에 따라 수 %</td><td>지구 자기장 50 &#956;T가 제대로 나오는지 먼저 확인</td></tr>'
assert old_row in s3
s3=s3.replace(old_row,'<tr><td>폰 센서 자체 오차</td><td>기종에 따라 수 %</td><td>지구 자기장 50 &#956;T가 제대로 나오는지 먼저 확인. 크기는 3.7절 폰 비교와 실험 C로 따로 확인한다</td></tr>')
old_sub='<p class="sub">코일 담당자용. 스마트폰을 자기장 측정기로 쓴다. 이 파트의 핵심은 지구 자기장을 지우는 방법이다.</p>'
assert old_sub in s3
s3=s3.replace(old_sub,'<p class="sub">코일 담당자용. 스마트폰을 자기장 측정기로 쓴다. 이 파트에서 가장 중요한 것은 지구 자기장을 지우는 방법이다. 개정판에서 폰 4대 비교(3.7절)가 더해졌다.</p>')
k=s3.rindex('  </div>\n</section>')
s3=s3[:k]+sub_figs(rd('blk_s37.html'))+s3[k:]
out+=s3+'\n\n'

# ---------- new s4c ----------
out+=sub_figs(rd('blk_s4c.html'))+'\n'

# ---------- s35 + C table ----------
s35=section('s35')
k=s35.index('    <div class="note w">\n      <span class="tagline">데이터를 버려야 할 때</span>')
s35=s35[:k]+rd('blk_s35add.html').strip('\n')+'\n\n'+s35[k:]
out+=s35+'\n\n'

# ---------- analysis s4 ----------
old4=section('s4')
figs=re.findall(r'<svg.*?</svg>',old4,re.S)
assert len(figs)==2
a4=rd('blk_s4.html').replace('{{old_err}}',figs[0]).replace('{{old_minmax}}',figs[1])
out+=a4+'\n'

# ---------- s5, s6, s7 + s8 + footer ----------
out+=rd('blk_s5.html')+'\n'+rd('blk_s6.html')+'\n'+rd('blk_s7.html')
open('/home/claude/emc2/study2.html','w',encoding='utf-8').write(out)
print(len(out), out.count('{{'))
