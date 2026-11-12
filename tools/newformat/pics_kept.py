"""Header strips that were already drawn (no emoji), kept from 2026-11-11."""
from drawn import INK, BLUE, RED, GREEN, AMBER, LINE
def blink(dur=1.6, begin=0, lo=.25):
    return f'<animate attributeName="opacity" values="1;{lo};1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>'
def strip(*els, label=''):
    return f'<svg viewBox="0 0 340 60" aria-hidden="true">{"".join(els)}</svg>'
def sbatt(x, col, dur):
    return (f'<rect x="{x}" y="14" width="92" height="36" rx="7" fill="#fffdf6" stroke="{INK}" stroke-width="3.5"/><rect x="{x+92}" y="24" width="7" height="16" rx="2" fill="{INK}"/>'
            f'<rect x="{x+6}" y="20" height="24" rx="3" fill="{col}"><animate attributeName="width" values="80;4;80" keyTimes="0;.9;1" dur="{dur}s" repeatCount="indefinite"/></rect>')
def sclock(x=170):
    hand = lambda L, w, dur: f'<line x1="{x}" y1="30" x2="{x}" y2="{30 - L}" stroke="{INK}" stroke-width="{w}" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="0 {x} 30;360 {x} 30" dur="{dur}s" repeatCount="indefinite"/></line>'
    return f'<circle cx="{x}" cy="30" r="27" fill="#fffdf6" stroke="{INK}" stroke-width="3.5"/>' + ''.join(f'<line x1="{x}" y1="6" x2="{x}" y2="10" stroke="{INK}" stroke-width="2.5" transform="rotate({a} {x} 30)"/>' for a in range(0, 360, 30)) + hand(14, 4.5, 48) + hand(22, 3, 4) + f'<circle cx="{x}" cy="30" r="3" fill="{RED}"/>'
KEPT = {
    'u4l8': strip(''.join(f'<circle cx="{95 + i*50}" cy="30" r="15" fill="{BLUE}">{blink(3.2, i * .8, .2)}</circle>' for i in range(4))),
    'u5l4': strip(sbatt(60, GREEN, 8), sbatt(190, RED, 5)),
    'u6l9': strip(sclock(170)),
    'u8l8': strip(f'<g stroke-width="5" stroke-linecap="round"><line x1="100" y1="50" x2="240" y2="10" stroke="{BLUE}"><animateTransform attributeName="transform" type="rotate" values="0 170 30;-22 170 30;0 170 30" dur="4s" repeatCount="indefinite"/></line><line x1="100" y1="12" x2="240" y2="48" stroke="{RED}"><animateTransform attributeName="transform" type="rotate" values="0 170 30;22 170 30;0 170 30" dur="4s" repeatCount="indefinite"/></line></g>'),
}
