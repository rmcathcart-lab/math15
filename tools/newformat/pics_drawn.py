"""Drawn warm-up pictures and header strips (2026-11-12). Replaces every emoji picture: Ryan found the moving emoji lazy
and prefers drawn animations. Pictures: viewBox 330 x 250 (unless noted). Strips: viewBox 340 x 60, purely for fun,
never information the puzzle needs, never the answer."""
from drawn import *
def svg(inner, label, vb='0 0 330 250', style=''):
    st = f' style="{style}"' if style else ''
    return f'<svg viewBox="{vb}" role="img" aria-label="{label}"{st}>{inner}</svg>'
def ico(obj, label=''):
    """A small drawn icon that sits in a line of text (e.g. the fruit puzzles)."""
    return f'<svg class="vw-ico" viewBox="-20 -20 40 40" role="img" aria-label="{label}" style="width:1.25em;height:1.25em;vertical-align:-.28em">{obj}</svg>'
APPLE, BANANA, COCONUT = ico(apple(), 'apple'), ico(banana(), 'banana'), ico(coconut(), 'coconut')

# ---------------- pictures (side pictures beside the text) ----------------
COOKIE = svg(at(242, 172, bob(cookie(), 6, 2.4), 2.3) +
             f'<g><animateTransform attributeName="transform" type="rotate" values="0 120 150;-28 120 150;0 120 150" dur="2.4s" repeatCount="indefinite"/><path d="M60 110 H150 L140 180 H70 Z" fill="{PAPER}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/><path d="M150 122 H186" stroke="{INK}" stroke-width="7" stroke-linecap="round"/><text x="105" y="158" font-size="30" font-weight="800" fill="{BLUE}" text-anchor="middle">⅓</text></g>',
             'A one-third measuring cup and a cookie')

def _grid(cols, rows, cell, ox, oy):
    return f'<g stroke="{LINE}" stroke-width="1.5">' + ''.join(f'<line x1="{ox+c*cell}" y1="{oy}" x2="{ox+c*cell}" y2="{oy+rows*cell}"/>' for c in range(cols + 1)) + ''.join(f'<line x1="{ox}" y1="{oy+r*cell}" x2="{ox+cols*cell}" y2="{oy+r*cell}"/>' for r in range(rows + 1)) + '</g>'
DRONE = svg(_grid(12, 5, 22, 30, 60) + f'<path d="M30 170 H294 V60" fill="none" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/><line x1="30" y1="170" x2="294" y2="60" stroke="{BLUE}" stroke-width="3" stroke-dasharray="7 7"/>'
            + at(294, 36, house(), 1.05) +
            f'<g><animateMotion dur="5s" repeatCount="indefinite" path="M30 170 H294 V60"/>{at(0, -8, truck(), .62)}</g>'
            f'<g><animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.76;1" calcMode="linear" path="M30 170 L294 60"/>'
            f'<line x1="-11" y1="-6" x2="11" y2="-6" stroke="{INK}" stroke-width="2.5"/><ellipse cx="-11" cy="-8" rx="7" ry="2" fill="{GREY}"><animate attributeName="rx" values="7;2;7" dur=".25s" repeatCount="indefinite"/></ellipse><ellipse cx="11" cy="-8" rx="7" ry="2" fill="{GREY}"><animate attributeName="rx" values="2;7;2" dur=".25s" repeatCount="indefinite"/></ellipse><rect x="-6" y="-6" width="12" height="9" rx="3" fill="{BLUE}"/></g>'
            f'<text x="162" y="196" font-size="17" fill="{INK}" text-anchor="middle">12 blocks</text><text x="312" y="120" font-size="17" fill="{INK}" text-anchor="middle">5</text>',
            'A truck driving around the corner while a drone flies straight')

TAXI = svg(f'<line x1="0" y1="178" x2="330" y2="178" stroke="{INK}" stroke-width="4"/><line x1="0" y1="200" x2="330" y2="200" stroke="{LINE}" stroke-width="4" stroke-dasharray="26 18"><animate attributeName="stroke-dashoffset" values="0;-44" dur=".8s" repeatCount="indefinite"/></line>'
           + at(165, 152, bob(taxi(.4), 1.5, .5), 3.6) +
           f'<text x="165" y="52" font-size="30" font-weight="800" fill="{GREEN}" text-anchor="middle">$4 + $2 + $2 + …</text>', 'A taxi driving along')

MOVIE = svg(at(100, 140, bob(ticket(), 4, 1.8), 2.9) + at(232, 135, bob(popcorn(), 4, 1.8, .6), 3.2), 'A movie ticket and popcorn')
STORE = svg(at(110, 130, bob(pencil(), 4, 1.8), 3.2) + at(232, 125, bob(eraser(), 4, 1.8, .6), 2.9), 'A pencil and an eraser')

def pheasant():
    return (f'<path d="M-6 2 Q-26 -2 -40 -16 Q-24 -2 -10 8 Z" fill="{BROWN}" {W}/><path d="M-8 6 Q-34 4 -44 -6" fill="none" stroke="{BROWN}" stroke-width="3" stroke-linecap="round"/>'
            f'<line x1="-2" y1="12" x2="-4" y2="24" {W}/><line x1="6" y1="12" x2="8" y2="24" {W}/>'
            f'<ellipse cx="2" cy="4" rx="15" ry="11" fill="#b8642e" {W}/><path d="M-4 0 Q4 6 12 -1" fill="none" stroke="#8a4520" stroke-width="2"/>'
            f'<path d="M10 -2 Q12 -14 16 -20" fill="none" stroke="{GREEN}" stroke-width="7" stroke-linecap="round"/><circle cx="17" cy="-21" r="6" fill="{GREEN}" {W}/>'
            f'<circle cx="18" cy="-22" r="3.2" fill="{RED}"/><circle cx="18.5" cy="-22.5" r="1.1" fill="{INK}"/><path d="M22 -21 L28 -19 L22 -17 Z" fill="{AMBER}" stroke="{INK}" stroke-width="1.5"/>')
def rabbit():
    return (f'<ellipse cx="6" cy="-24" rx="4" ry="13" fill="#d8d2c4" {W} transform="rotate(12 6 -24)"/><ellipse cx="-3" cy="-24" rx="4" ry="13" fill="#d8d2c4" {W} transform="rotate(-6 -3 -24)"/>'
            f'<ellipse cx="-2" cy="8" rx="17" ry="15" fill="#d8d2c4" {W}/><circle cx="-14" cy="18" r="5" fill="#fff" stroke="{INK}" stroke-width="2"/>'
            f'<circle cx="4" cy="-8" r="11" fill="#d8d2c4" {W}/><circle cx="8" cy="-10" r="1.8" fill="{INK}"/><path d="M13 -5 L15 -6" stroke="{INK}" stroke-width="2" stroke-linecap="round"/>'
            f'<ellipse cx="10" cy="20" rx="7" ry="3.5" fill="#d8d2c4" {W}/>')
CAGE = svg(at(108, 150, bob(pheasant(), 6, 1.4), 1.9) + at(232, 152, bob(rabbit(), 10, 1.2, .5), 1.8) +
           f'<g stroke="{INK}" stroke-width="4" stroke-linecap="round">' + ''.join(f'<line x1="{30 + i*30}" y1="40" x2="{30 + i*30}" y2="200"/>' for i in range(10)) + '<line x1="20" y1="40" x2="310" y2="40"/><line x1="20" y1="200" x2="310" y2="200"/></g>',
           'A pheasant and a rabbit in a cage')

# 3.3: a real calendar page; a box hops from one 2 x 2 block to another
def _calendar():
    cw, ch, ox, oy = 72, 56, 10, 92
    out = (f'<rect x="4" y="4" width="{7*cw + 12}" height="{oy + 5*ch + 6}" rx="16" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>'
           f'<path d="M4 20 Q4 4 20 4 H{7*cw - 4} Q{7*cw + 16} 4 {7*cw + 16} 20 V52 H4 Z" fill="{RED}"/>'
           f'<text x="{(7*cw + 20)/2}" y="40" font-size="26" font-weight="800" fill="#fff" text-anchor="middle" font-family="system-ui, sans-serif">November 2026</text>')
    out += ''.join(f'<text x="{ox + c*cw + cw/2}" y="76" font-size="17" font-weight="700" fill="{INK}" opacity=".6" text-anchor="middle" font-family="system-ui, sans-serif">{d}</text>' for c, d in enumerate(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']))
    out += f'<g stroke="{LINE}" stroke-width="1.5">' + ''.join(f'<line x1="{ox}" y1="{oy + r*ch}" x2="{ox + 7*cw}" y2="{oy + r*ch}"/>' for r in range(6)) + ''.join(f'<line x1="{ox + c*cw}" y1="{oy}" x2="{ox + c*cw}" y2="{oy + 5*ch}"/>' for c in range(8)) + '</g>'
    # the hopping box (drawn under the numbers): top-left dates 3, 11, 16, 23, 19
    spots = [(0, 2), (1, 3), (2, 1), (3, 1), (2, 4)]
    vals = ';'.join(f'{c*cw} {r*ch}' for r, c in spots) + f';{spots[0][1]*cw} {spots[0][0]*ch}'
    kt = ';'.join(f'{i/len(spots):.3f}' for i in range(len(spots))) + ';1'
    box = (f'<rect x="{ox+3}" y="{oy+3}" width="{2*cw - 6}" height="{2*ch - 6}" rx="10" fill="{BLUE}" fill-opacity=".09" stroke="{BLUE}" stroke-width="4"/>'
           f'<line x1="{ox + cw/2 + 10}" y1="{oy + ch/2 + 8}" x2="{ox + 1.5*cw - 10}" y2="{oy + 1.5*ch - 8}" stroke="{RED}" stroke-width="3" opacity=".45"/>'
           f'<line x1="{ox + 1.5*cw - 10}" y1="{oy + ch/2 + 8}" x2="{ox + cw/2 + 10}" y2="{oy + 1.5*ch - 8}" stroke="{GREEN}" stroke-width="3" opacity=".45"/>')
    out += f'<g><animateTransform attributeName="transform" type="translate" values="{vals}" keyTimes="{kt}" calcMode="discrete" dur="{2.6*len(spots)}s" repeatCount="indefinite"/>{box}</g>'
    for d in range(1, 31):
        r, c = divmod(d - 1, 7)
        out += f'<text x="{ox + c*cw + cw/2}" y="{oy + r*ch + ch/2 + 9}" font-size="26" font-weight="700" fill="{INK}" text-anchor="middle" font-family="system-ui, sans-serif">{d}</text>'
    return out
CALENDAR = svg(_calendar(), 'A calendar page for November 2026, with a box around a 2 by 2 block of dates', f'0 0 {7*72 + 20} {92 + 5*56 + 14}', 'max-width:470px')

# 5.5: a ladder leaning on a wall, sun straight overhead
def _ladder():
    c, ox, oy = 40, 30, 250                       # 1 square = 1 m; (0, 0) at (ox, oy)
    X = lambda x: ox + x*c; Y = lambda y: oy - y*c
    out = f'<g stroke="{LINE}" stroke-width="1.5">' + ''.join(f'<line x1="{X(i)}" y1="{Y(0)}" x2="{X(i)}" y2="{Y(5)}"/>' for i in range(10)) + ''.join(f'<line x1="{X(0)}" y1="{Y(j)}" x2="{X(9)}" y2="{Y(j)}"/>' for j in range(6)) + '</g>'
    out += f'<rect x="{X(6)}" y="{Y(4)}" width="{c*.5}" height="{4*c}" fill="#e6dcc3" stroke="{INK}" stroke-width="3"/>' + ''.join(f'<line x1="{X(6)}" y1="{Y(4) + k*20}" x2="{X(6.5)}" y2="{Y(4) + k*20 + 10}" stroke="#c9b893" stroke-width="2"/>' for k in range(8))
    out += f'<line x1="{X(0) - 8}" y1="{Y(0)}" x2="{X(9) + 8}" y2="{Y(0)}" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    fx, fy, tx, ty = X(2), Y(0), X(6), Y(3); px, py = 0.6*5, 0.8*5
    out += f'<g stroke="{BROWN}" stroke-width="5" stroke-linecap="round"><line x1="{fx - px}" y1="{fy - py}" x2="{tx - px}" y2="{ty - py}"/><line x1="{fx + px}" y1="{fy + py}" x2="{tx + px}" y2="{ty + py}"/>'
    out += ''.join(f'<line x1="{fx + (tx-fx)*t - px:.1f}" y1="{fy + (ty-fy)*t - py:.1f}" x2="{fx + (tx-fx)*t + px:.1f}" y2="{fy + (ty-fy)*t + py:.1f}" stroke-width="3"/>' for t in (.12, .26, .4, .54, .68, .82, .96)) + '</g>'
    sx, sy = X(4), Y(5) - 34
    rays = ''.join(f'<line x1="{sx}" y1="{sy - 20}" x2="{sx}" y2="{sy - 27}" transform="rotate({a} {sx} {sy})"/>' for a in range(0, 360, 30))
    out += f'<g stroke="{AMBER}" stroke-width="3.5" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="0 {sx} {sy};30 {sx} {sy}" dur="3s" repeatCount="indefinite"/>{rays}</g><circle cx="{sx}" cy="{sy}" r="14" fill="{AMBER}"/>'
    return out
LADDER = svg(_ladder(), 'A ladder leaning against a wall on a grid, with the sun straight overhead', '10 -20 390 285')

# 5.7: a graphing calculator whose screen shows the axes and nothing else
def _calc():
    out = f'<rect x="85" y="6" width="160" height="240" rx="18" fill="#3d4652" stroke="{INK}" stroke-width="3"/><rect x="99" y="20" width="132" height="98" rx="5" fill="#cfe0c3" stroke="#28303a" stroke-width="3"/>'
    cx, cy = 165, 69
    out += f'<g stroke="{INK}" stroke-width="1.6"><line x1="103" y1="{cy}" x2="227" y2="{cy}"/><line x1="{cx}" y1="24" x2="{cx}" y2="114"/>' + ''.join(f'<line x1="{cx + k*6}" y1="{cy - 2}" x2="{cx + k*6}" y2="{cy + 2}"/>' for k in range(-10, 11) if k) + ''.join(f'<line x1="{cx - 2}" y1="{cy + k*4.4:.1f}" x2="{cx + 2}" y2="{cy + k*4.4:.1f}"/>' for k in range(-10, 11) if k) + '</g>'
    out += f'<rect x="218" y="100" width="8" height="11" fill="{INK}"><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1s" repeatCount="indefinite"/></rect>'
    labels = ['Y=', 'WINDOW', 'ZOOM', 'TRACE', 'GRAPH']
    for i, t in enumerate(labels):
        x = 101 + i*26.5
        fill = AMBER if t == 'GRAPH' else '#6b7684'
        anim = f'<animate attributeName="fill" values="{AMBER};#fff3c4;{AMBER}" dur="1.2s" repeatCount="indefinite"/>' if t == 'GRAPH' else ''
        out += f'<rect x="{x}" y="128" width="23" height="11" rx="4" fill="{fill}">{anim}</rect><text x="{x + 11.5}" y="148" font-size="6.4" font-weight="700" fill="#e9edf2" text-anchor="middle" font-family="system-ui, sans-serif">{t}</text>'
    out += ''.join(f'<rect x="{101 + c*26.5}" y="{158 + r*17}" width="23" height="12" rx="4" fill="{"#e9edf2" if r > 1 and 0 < c < 4 else "#6b7684"}"/>' for r in range(5) for c in range(5))
    return out
CALC_BLANK = svg(_calc(), 'A graphing calculator showing axes and no line')

# 3.6: a square sheet, corners cut out, then the open-top box it folds into
def _boxfold():
    sheet = (f'<rect x="85" y="45" width="160" height="160" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>'
             f'<g fill="none" stroke="{GREY}" stroke-width="2" stroke-dasharray="6 5"><line x1="117" y1="45" x2="117" y2="205"/><line x1="213" y1="45" x2="213" y2="205"/><line x1="85" y1="77" x2="245" y2="77"/><line x1="85" y1="173" x2="245" y2="173"/></g>'
             f'<text x="165" y="232" font-size="18" fill="{INK}" text-anchor="middle">20 cm</text><text x="62" y="130" font-size="18" fill="{INK}" text-anchor="middle" transform="rotate(-90 62 130)">20 cm</text>')
    corners = ''.join(f'<rect x="{x}" y="{y}" width="32" height="32" fill="{RED}" fill-opacity=".85" stroke="{INK}" stroke-width="2"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.08;.16;.3;.38;1" dur="7s" repeatCount="indefinite"/></rect>'
                      for x, y in ((85, 45), (213, 45), (85, 173), (213, 173)))
    holes = ''.join(f'<rect x="{x}" y="{y}" width="32" height="32" fill="#fff"><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.3;.38;1" dur="7s" repeatCount="indefinite"/></rect>' for x, y in ((83, 43), (215, 43), (83, 175), (215, 175)))
    flat = f'<g><animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.48;.56;.96;1" dur="7s" repeatCount="indefinite"/>{sheet}{holes}{corners}</g>'
    FL, FR, h, dx, dy = 70, 210, 64, 52, -40
    yt = 150
    P = lambda *pts: ' '.join(f'{x},{y}' for x, y in pts)
    box = (f'<polygon points="{P((FL+dx, yt+dy), (FR+dx, yt+dy), (FR+dx, yt+dy+h), (FL+dx, yt+dy+h))}" fill="#efe5cf" stroke="{INK}" stroke-width="2.5"/>'
           f'<polygon points="{P((FL, yt), (FL+dx, yt+dy), (FL+dx, yt+dy+h), (FL, yt+h))}" fill="#e3d6b8" stroke="{INK}" stroke-width="2.5"/>'
           f'<polygon points="{P((FL, yt+h), (FR, yt+h), (FR+dx, yt+dy+h), (FL+dx, yt+dy+h))}" fill="#f5eedd" stroke="{INK}" stroke-width="2.5"/>'
           f'<polygon points="{P((FR, yt), (FR+dx, yt+dy), (FR+dx, yt+dy+h), (FR, yt+h))}" fill="#d8c9a6" stroke="{INK}" stroke-width="2.5"/>'
           f'<polygon points="{P((FL, yt), (FR, yt), (FR, yt+h), (FL, yt+h))}" fill="{PAPER}" stroke="{INK}" stroke-width="3"/>'
           f'<polygon points="{P((FL, yt), (FR, yt), (FR+dx, yt+dy), (FL+dx, yt+dy))}" fill="none" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>')
    folded = f'<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.52;.6;.92;1" dur="7s" repeatCount="indefinite"/>{box}</g>'
    return flat + folded
BOXFOLD = svg(_boxfold(), 'A square sheet with its corners cut out, then the open-top box it folds into')

# ---------------- header strips ----------------
def rise(obj, x, dur=3, begin=0):
    return (f'<g><animateTransform attributeName="transform" type="translate" values="{x} 70;{x} -10" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>'
            f'<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.75;1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>{obj}</g></g>')
def sway(obj, x0, x1, y, dur=4):
    return f'<g><animateTransform attributeName="transform" type="translate" values="{x0} {y};{x1} {y};{x0} {y}" dur="{dur}s" repeatCount="indefinite"/>{obj}</g>'
def flip(obj, x, y, dur=3, begin=0):
    return (f'<g transform="translate({x} {y})"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;.05 1;1 1;1 1" keyTimes="0;.4;.5;.6;1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>{obj}</g></g>')
def road(y=54):
    return f'<line x1="0" y1="{y}" x2="340" y2="{y}" stroke="{LINE}" stroke-width="3" stroke-dasharray="16 12"><animate attributeName="stroke-dashoffset" values="0;-28" dur=".7s" repeatCount="indefinite"/></line>'
def lie_detector():
    import random
    rnd = random.Random(7); pts, x = [], 0
    while x <= 480:
        y = 30 + (rnd.choice([-3, -2, 2, 3]) if x % 120 < 90 else rnd.choice([-16, 15, -12, 14]))
        pts.append(f'{x},{y}'); x += 8
    line = f'<polyline points="{" ".join(pts)}" fill="none" stroke="{RED}" stroke-width="2.2" stroke-linejoin="round"/>'
    return (f'<defs><clipPath id="vwc-lie"><rect x="70" y="8" width="200" height="44" rx="4"/></clipPath></defs>'
            f'<rect x="70" y="8" width="200" height="44" rx="4" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            + ''.join(f'<line x1="70" y1="{y}" x2="270" y2="{y}" stroke="{LINE}" stroke-width="1"/>' for y in (19, 30, 41)) +
            f'<g clip-path="url(#vwc-lie)"><g><animateTransform attributeName="transform" type="translate" values="70 0;-170 0" dur="6s" repeatCount="indefinite"/>{line}</g></g>'
            f'<rect x="276" y="22" width="34" height="16" rx="3" fill="{GREY}" stroke="{INK}" stroke-width="2"/><line x1="278" y1="30" x2="262" y2="30" stroke="{INK}" stroke-width="2.5" stroke-linecap="round"/>')
def tiles12():
    """12 square tiles that rearrange: 1 x 12, then 2 x 6, then 3 x 4 (a pile of 12, not one of the warm-up's piles)."""
    s, g = 12, 2.5
    lay = [(12, 1), (6, 2), (4, 3)]
    out = ''
    for i in range(12):
        xs, ys = [], []
        for cols, rows in lay:
            r, c = divmod(i, cols)
            W_, H_ = cols*(s+g), rows*(s+g)
            xs.append(170 - W_/2 + c*(s+g)); ys.append(30 - H_/2 + r*(s+g))
        xv = ';'.join(f'{v:.1f};{v:.1f}' for v in xs) + f';{xs[0]:.1f}'; yv = ';'.join(f'{v:.1f};{v:.1f}' for v in ys) + f';{ys[0]:.1f}'
        kt = '0;.25;.33;.58;.66;.92;1'
        out += (f'<rect width="{s}" height="{s}" rx="2" fill="{[BLUE, AMBER, GREEN, RED][i % 4]}" stroke="{INK}" stroke-width="1.2">'
                f'<animate attributeName="x" values="{xv}" keyTimes="{kt}" dur="7s" repeatCount="indefinite"/><animate attributeName="y" values="{yv}" keyTimes="{kt}" dur="7s" repeatCount="indefinite"/></rect>')
    return out
def three_tiles():
    xs = (110, 180, 250)
    out = ''
    for i, (x, t) in enumerate(zip(xs, ('×4', '( )²', '÷2'))):
        tt = (x - 30) / 300
        out += (f'<rect x="{x - 24}" y="12" width="48" height="36" rx="8" fill="{PAPER}" stroke="{BLUE}" stroke-width="2.6">'
                f'<animate attributeName="fill" values="{PAPER};{PAPER};#dbe7f8;{PAPER};{PAPER}" keyTimes="0;{max(tt - .04, 0):.2f};{tt:.2f};{tt + .08:.2f};1" dur="5s" repeatCount="indefinite"/></rect>'
                f'<text x="{x}" y="36" font-size="17" font-weight="800" fill="{BLUE}" text-anchor="middle" font-family="system-ui, sans-serif">{t}</text>')
    token = f'<circle r="9" fill="{AMBER}" stroke="{INK}" stroke-width="2"/>'
    return out + f'<g><animateTransform attributeName="transform" type="translate" values="30 30;330 30" dur="5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.05;.9;1" dur="5s" repeatCount="indefinite"/>{token}</g>'
def toothpick_houses():
    out = ''; k = 0
    for h in range(3):
        x0 = 110 + h*40
        segs = ([(x0, 50, x0, 26)] if h == 0 else []) + [(x0, 50, x0 + 40, 50), (x0 + 40, 50, x0 + 40, 26), (x0, 26, x0 + 40, 26), (x0, 26, x0 + 20, 8), (x0 + 20, 8, x0 + 40, 26)]
        for (a, b, c, d) in segs:
            t = k * .045
            out += (f'<line x1="{a}" y1="{b}" x2="{c}" y2="{d}" stroke="#c9902f" stroke-width="4" stroke-linecap="round" opacity="0">'
                    f'<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;{t:.3f};{t + .03:.3f};.9;1" dur="8s" repeatCount="indefinite"/></line>')
            k += 1
    return out
def machine_box(label='f'):
    return (f'<rect x="-24" y="-20" width="48" height="40" rx="6" fill="{BLUE}" {W}/><rect x="-30" y="-8" width="6" height="16" fill="{INK}"/><rect x="24" y="-8" width="6" height="16" fill="{INK}"/>'
            f'<text x="0" y="8" font-size="22" font-style="italic" font-weight="700" fill="#fff" text-anchor="middle" font-family="Georgia, serif">{label}</text>')
def coaster():
    tr = coaster_track()
    supports = ''.join(f'<line x1="{x}" y1="{y}" x2="{x}" y2="60" stroke="{GREY}" stroke-width="2"/>' for x, y in ((70, 12), (140, 41), (210, 16), (300, 45)))
    cart = f'<g><animateMotion dur="5s" repeatCount="indefinite" rotate="auto" path="{tr}"/><rect x="-10" y="-11" width="20" height="9" rx="3" fill="{RED}" stroke="{INK}" stroke-width="1.8"/><circle cx="-5" cy="-1" r="2.5" fill="{INK}"/><circle cx="5" cy="-1" r="2.5" fill="{INK}"/></g>'
    return supports + f'<path d="{tr}" fill="none" stroke="{INK}" stroke-width="3"/>' + cart

STRIPS = {
    'u1l1': strip(at(48, 30, phone()), fade(at(100, 22, bubble(BLUE, 34)), dur=4), fade(at(150, 38, bubble(GREEN, 28, True)), dur=4, begin=1.2),
                  rise(at(0, 0, heart(), .9), 225, 3, 0), rise(at(0, 0, heart(PINK), .8), 262, 3.4, .9), rise(at(0, 0, heart(), .7), 300, 2.8, 1.7)),
    'u1l4': strip(''.join(at(x, 30, card('?', c, 26, 34, 20)) for x, c in ((120, BLUE), (165, GREEN), (210, AMBER), (255, RED))), sway(magnifier(), 100, 275, 26, 5)),
    'u1l6': strip(f'<line x1="110" y1="54" x2="240" y2="54" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>' +
                  ''.join(f'<rect x="{x}" width="26" rx="3" fill="{c}" stroke="{INK}" stroke-width="2"><animate attributeName="height" values="{a};{b};{a}" dur="3s" repeatCount="indefinite"/><animate attributeName="y" values="{54 - a};{54 - b};{54 - a}" dur="3s" repeatCount="indefinite"/></rect>'
                          for x, c, a, b in ((125, BLUE, 20, 44), (162, GREEN, 40, 18), (199, AMBER, 30, 38)))),
    'u1l8': strip(lie_detector()),
    'u2l4': strip(three_tiles()),
    'u2l7': strip(at(170, 33, scale_beam(card('?', BLUE, 26, 30, 18), card('?', RED, 26, 30, 18)), 1)),
    'u2l8': strip(at(80, 30, stopwatch()), ''.join(fade(at(x, 32, person(c), .9), '0;1;1;0', f'0;{.1 + i*.08:.2f};.85;1', 5) for i, (x, c) in enumerate(zip(range(140, 320, 26), [BLUE, RED, GREEN, AMBER, BLUE, RED, GREEN])))),
    'u2l10': strip(twinkle(60, 18), twinkle(150, 44, BLUE, .8, 1.3, .4), twinkle(250, 14, AMBER, 1, 1.8, .9), twinkle(305, 46, RED, .7, 1.4, .2),
                   f'<g><animateTransform attributeName="transform" type="translate" values="-40 58;380 0" dur="4s" repeatCount="indefinite"/>{at(0, 0, rocket(), .9, -8)}</g>'),
    'u3l1': strip(at(110, 32, bob(apple(), 5, 1.5)), at(170, 32, bob(banana(), 5, 1.5, .3)), at(230, 32, bob(coconut(), 5, 1.5, .6))),
    'u3l2': strip(at(120, 30, calculator('8888')), at(185, 30, stopwatch(2)), at(250, 31, head_gears())),
    'u3l4': strip(at(170, 30, head_gears(), 1.15)),
    'u3l5': strip(f'<g transform="rotate(-3 170 30)"><rect x="115" y="5" width="110" height="50" rx="3" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' +
                  ''.join(f'<line x1="125" y1="{y}" x2="{x2}" y2="{y}" stroke="{GREY}" stroke-width="3" stroke-linecap="round"/>' for y, x2 in ((17, 210), (29, 190), (41, 205))) +
                  f'<ellipse cx="160" cy="29" rx="42" ry="9" fill="none" stroke="{RED}" stroke-width="3" stroke-dasharray="190" stroke-dashoffset="190">'
                  f'<animate attributeName="stroke-dashoffset" values="190;190;0;0;190" keyTimes="0;.2;.5;.9;1" dur="4s" repeatCount="indefinite"/></ellipse></g>'),
    'u3l7': strip(twinkle(120, 18, AMBER, 1, 1.6), twinkle(222, 22, BLUE, .9, 1.3, .5), twinkle(170, 8, AMBER, .6, 1.1, .9), at(170, 33, crystal_ball(), 1.05)),
    'u4l1': strip(tiles12()),
    'u4l2': strip(at(130, 34, bob(giftbag(BLUE), 4, 1.6)), at(175, 34, bob(giftbag(GREEN), 4, 1.6, .4)), rise(at(0, 0, balloon(RED), .8), 230, 4, 0), rise(at(0, 0, balloon(AMBER), .8), 275, 4.6, 1.5)),
    'u4l3': strip(flip(card('?', BLUE), 120, 30, 3), f'<text x="152" y="38" font-size="24" font-weight="800" fill="{INK}" text-anchor="middle">×</text>', flip(card('?', RED), 184, 30, 3, .5),
                  f'<text x="240" y="38" font-size="24" font-weight="800" fill="{INK}" text-anchor="middle" font-family="system-ui, sans-serif">= 12</text>'),
    'u4l4': strip(flip(card('?', BLUE), 112, 30, 3), f'<text x="144" y="38" font-size="24" font-weight="800" fill="{INK}" text-anchor="middle">×</text>', flip(card('?', RED), 176, 30, 3, .5),
                  f'<text x="238" y="38" font-size="24" font-weight="800" fill="{INK}" text-anchor="middle" font-family="system-ui, sans-serif">= −24</text>'),
    'u4l5': strip(''.join(at(x, 32 + (6 if i % 2 else -6), footprint(i % 2 == 1), 1, 90) for i, x in enumerate(range(90, 290, 26))), sway(magnifier(), 90, 290, 27, 6)),
    'u4l6': strip(at(132, 36, head_gears(), .95), at(205, 26, thought(), 1)),
    'u4l7': strip(at(140, 30, bob(card('?', BLUE), 5, 1.5)), at(200, 30, bob(card('?', RED), 5, 1.5, .75)), twinkle(170, 12, AMBER, .7, 1.4), twinkle(235, 46, AMBER, .6, 1.6, .5)),
    'u4l9': strip(at(150, 30, bob(card('?', BLUE, 30, 40, 24), 4, 1.8)), at(215, 30, rock(mask(), 0, 0, 10, 2.2), .95)),
    'u4l10': strip(lie_detector()),
    'u5l1': strip(at(60, 30, phone()), at(280, 30, phone(GREEN)), f'<g><animateTransform attributeName="transform" type="translate" values="90 26;250 26" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="2.6s" repeatCount="indefinite"/>{envelope()}</g>'),
    'u5l2': strip(toothpick_houses()),
    'u5l3': strip(at(170, 30, machine_box(''), 1) + at(170, 30, spin(gear(11, 8, AMBER), 0, 0, 2.5)),
                  f'<g><animateTransform attributeName="transform" type="translate" values="80 30;135 30;135 30" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.38;.42;1" dur="3s" repeatCount="indefinite"/><circle r="8" fill="{BLUE}" stroke="{INK}" stroke-width="2"/></g>',
                  f'<g><animateTransform attributeName="transform" type="translate" values="205 30;205 30;265 30" keyTimes="0;.55;1" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.55;.6;1" dur="3s" repeatCount="indefinite"/><rect x="-8" y="-8" width="16" height="16" rx="3" fill="{RED}" stroke="{INK}" stroke-width="2"/></g>'),
    'u5l6': strip(coaster()),
    'u5l7': None,
    'u5l8': strip(at(140, 32, vending(), 1.1), at(205, 32, vending(), 1.1)),
    'u5l9': strip(at(170, 32, machine_box('f')),
                  f'<g><animateTransform attributeName="transform" type="translate" values="70 32;132 32;132 32" keyTimes="0;.4;1" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.38;.42;1" dur="3s" repeatCount="indefinite"/>'
                  f'<rect x="-16" y="-9" width="32" height="18" rx="3" fill="{PAPER}" stroke="{INK}" stroke-width="2"/><line x1="-10" y1="0" x2="10" y2="0" stroke="{GREY}" stroke-width="3" stroke-linecap="round"/></g>',
                  f'<g><animateTransform attributeName="transform" type="translate" values="212 32;212 32;272 32" keyTimes="0;.55;1" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.55;.6;1" dur="3s" repeatCount="indefinite"/>'
                  f'<circle r="10" fill="{AMBER}" stroke="{INK}" stroke-width="2"/></g>'),
    'u5l10': strip(at(150, 34, padlock()), at(212, 30, rock(key(), 0, 0, 14, 1.6), 1.1)),
    'u5l11': strip(f'<line x1="0" y1="56" x2="340" y2="56" stroke="{LINE}" stroke-width="3"/>', at(310, 34, flag()),
                   slide(at(0, 36, runner(RED, .4), .95), 10, 290, 3.2), slide(at(0, 36, runner(GREEN, .45, .2), .95), 10, 290, 3.8, .6)),
    'u5l12': strip(f'<g stroke="{LINE}" stroke-width="1.5">' + ''.join(f'<line x1="{x}" y1="14" x2="{x}" y2="56"/>' for x in range(110, 251, 20)) + ''.join(f'<line x1="110" y1="{y}" x2="250" y2="{y}"/>' for y in (14, 28, 42, 56)) + '</g>',
                   f'<g><animateTransform attributeName="transform" type="translate" values="190 -30;190 24;190 18;190 24;190 24" keyTimes="0;.3;.38;.46;1" dur="3s" repeatCount="indefinite"/>{at(0, 0, pin(), .9)}</g>'),
    'u6l6': strip(at(165, 32, slide_toy(), 1.15),
                  f'<g><animateMotion dur="2.4s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;.2;.75;1" calcMode="linear" path="M149 9 Q170 11 177 34 Q181 48 195 48"/><circle r="5" fill="{BLUE}" stroke="{INK}" stroke-width="1.5"/></g>'),
    'u6l7': strip(f'<line x1="0" y1="54" x2="340" y2="54" stroke="{INK}" stroke-width="3"/>', slide(at(0, 35, walker(BLUE), .95), 10, 330, 7)),
    'u6l8': strip(f'<g stroke="#c9a66b" stroke-width="4" stroke-linecap="round"><line x1="110" y1="26" x2="230" y2="22"/><line x1="110" y1="40" x2="230" y2="36"/></g>',
                  at(110, 33, fence_post()), at(170, 31, fence_post()), at(230, 29, fence_post()),
                  f'<line x1="70" y1="20" x2="270" y2="14" stroke="{RED}" stroke-width="2" stroke-dasharray="5 5"><animate attributeName="stroke-dashoffset" values="0;-20" dur="1s" repeatCount="indefinite"/></line>'),
    'u7l1': strip(f'<line x1="80" y1="52" x2="280" y2="8" stroke="{LINE}" stroke-width="2" stroke-dasharray="4 5"/>' + ''.join(f'<circle cx="{x}" cy="{52 - (x - 80)*.22:.1f}" r="4.5" fill="{BLUE}"/>' for x in range(95, 281, 30)),
                  f'<g><animateTransform attributeName="transform" type="translate" values="95 46;265 9;95 46" dur="5s" repeatCount="indefinite"/>{magnifier()}</g>'),
    'u7l2': strip(at(150, 30, bob(phone(), 3, 2)), at(198, 32, bars())),
    'u7l3': strip(at(110, 50, lilypad()), at(220, 50, lilypad()), at(300, 50, lilypad()),
                  at(80, 40, hop(frog(GREEN), 60, 22, 1.6), .8), at(180, 40, hop(frog(BLUE), 60, 22, 1.6, .8), .8)),
    'u7l7': strip(at(170, 33, rock(disguise(), 0, 0, 8, 2.4), 1.05)),
    'u7l9': strip(road(), slide(at(0, 40, tortoise(), .9), 120, 380, 14), slide(at(0, 38, hare(), .9), -40, 380, 3.5)),
    'u7l10': strip(lie_detector()),
    'u8l2': strip(road(), slide(at(0, 38, car(BLUE, .35), .9), -50, 390, 6), slide(at(0, 38, car(RED, .35), .9), -50, 390, 6, -2.1)),
    'u8l3': strip(at(170, 33, scale_beam(apple(), banana()), 1)),
    'u8l5': strip(at(150, 32, receipt()), at(205, 32, bob(f'<path d="M-9 -12 H9 L7 16 H-7 Z" fill="{RED}" stroke="{INK}" stroke-width="2"/><line x1="3" y1="-12" x2="7" y2="-20" stroke="{INK}" stroke-width="2.5" stroke-linecap="round"/>', 3, 1.8))),
}
STRIPS = {k: v for k, v in STRIPS.items() if v}
# strips that were drawn already (unchanged from 2026-11-11)
from pics_kept import KEPT
STRIPS.update(KEPT)
