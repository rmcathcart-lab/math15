T = lambda x: '<span class="tex">%s</span>' % x
BIG = lambda html: f'<div class="vw-q">{html}</div>'
SPECS = {}
SPECS['u4l9'] = dict(
    warm=dict(title='Who Am I?', rule='A number riddle. Find the number, and be ready to say how you know.',
              body=BIG('“My square is <b>5 times</b> me.”<small>Who am I?</small>'),
              nudge='How do you know?',
              reveal=f'<b>5</b>, because {T(r"5^2=25=5\times5")}. And also <b>0</b>, because {T(r"0^2=0=5\times0")}. Two numbers fit.'),
    extra_expl=['zeroGrid', 'notZero', 'subCheck', 'decompSolve'],
    practice=dict(after='ex3', qs='1–4', rest='5–15', line='Solve by factoring. Rearrange first when one side isn’t 0.',
                  chips=[('1', 'Already factored'), ('2', 'Factor, then split'), ('3–4', 'Rearrange first')],
                  note='We carry on when most of the class has finished Question 3.'),
)
SPECS['u4l10'] = dict(
    warm=dict(title='Two Truths and a Lie', rule='Two of these are true. One is a lie. Which one?',
              body=f'<div class="vw-tiles" style="--n:3;--fs:27px"><div><b>A</b>{T("x^2-9=(x-3)(x+3)")}</div><div><b>B</b>{T("x^2+9=(x+3)^2")}</div><div><b>C</b>{T("x^2+6x+9=(x+3)^2")}</div></div>',
              nudge='How could you prove it?',
              reveal=f'<b>B is the lie.</b> Expand it: {T("(x+3)^2=x^2+6x+9")}, not {T("x^2+9")}. A sum of squares doesn’t factor.'),
    extra_expl=['gcfEx', 'inspectA', 'inspectB', 'squares', 'perfect', 'decomp', 'flow', 'solveRev', 'garden'],
    replace=[(' (The checklist explainer in Section 7 replays Challenge 1, and the solving explainer in Section 8 replays Challenge 2.)',
              '<span data-extra> (The checklist explainer in Section 7 replays Challenge 1, and the solving explainer in Section 8 replays Challenge 2.)</span>')],
    practice=dict(after='ex5', qs='1–11', rest='12–24', line='One factoring type at a time.',
                  chips=[('1–3', 'Common factor'), ('4–7', 'Trinomials, ' + T('a=1')), ('8–11', 'Difference of squares and perfect squares')],
                  note='We carry on when most of the class has reached Question 8.'),
)

def grid_svg(cols, rows, marks, cell=46, extra=''):
    """A bare grid (no axes, no numbers). marks: [(col, row, text, colour)] at grid crossings, rows counted from the bottom."""
    W, H = cols * cell, rows * cell
    ln = ''.join(f'<line x1="{c*cell}" y1="0" x2="{c*cell}" y2="{H}"/>' for c in range(cols + 1)) + ''.join(f'<line x1="0" y1="{r*cell}" x2="{W}" y2="{r*cell}"/>' for r in range(rows + 1))
    mk = ''.join(f'<text x="{c*cell}" y="{H - r*cell}" fill="{col}" font-size="{int(cell*.9)}" font-weight="800" text-anchor="middle" dominant-baseline="central">{t}</text>' for c, r, t, col in marks)
    return f'<svg class="vw-grid" viewBox="-24 -24 {W+48} {H+48}" style="max-height:{H+48}px"><g stroke="#cfc8b8" stroke-width="1.5">{ln}</g>{extra}{mk}</svg>'
PIC = lambda inner, cap='': f'<div class="vw-pic">{inner}{("<p>" + cap + "</p>") if cap else ""}</div>'

SPECS['u5l1'] = dict(
    warm=dict(title='Where Is the ✕?', rule='Your friend has the same grid, but no ✕. You can only send them <b>numbers</b>. What do you send?',
              body=PIC(grid_svg(10, 6, [(7, 4, '✕', '#c93a33')])),
              nudge='Would your friend put it in exactly the right spot?',
              reveal='Two numbers are enough, for example <b>7 across and 4 up</b> from the bottom-left corner. But you both have to agree on where to start, and which number comes first.'),
    extra_cards=['s4b'],
    extra_expl=['readPoint', 'quadrants', 'pattern'],
    practice=dict(after='ex3', qs='1–9', rest='10–15', line='Vocabulary, reading points and plotting points.',
                  chips=[('1', 'Vocabulary'), ('2–7', 'Reading a grid'), ('8–9', 'Plotting and joining points')],
                  note='We carry on when most of the class has reached Question 8.'),
)

def toothpicks(n=3, s=84):
    L = []
    def t(x1, y1, x2, y2): L.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
    top, bot = s * .62, s * 1.62
    t(0, top + 6, 0, bot - 6)
    for i in range(n):
        x = i * s
        t(x + 6, top, x + s - 6, top); t(x + 6, bot, x + s - 6, bot); t(x + s, top + 6, x + s, bot - 6)
        t(x + 4, top - 6, x + s / 2 - 3, 6); t(x + s / 2 + 3, 6, x + s - 4, top - 6)
    W = n * s
    return f'<svg viewBox="-14 -6 {W+28} {bot+16}" style="max-width:{int(W*1.5)}px"><g stroke="#c9902f" stroke-width="7" stroke-linecap="round">{"".join(L)}</g></svg>'

SPECS['u5l2'] = dict(
    warm=dict(title='Toothpick Street', rule='These 3 houses took <b>16 toothpicks</b>. How many toothpicks for a street of <b>10 houses</b>?',
              body=PIC(toothpicks()),
              nudge='Why isn’t it just 10 times one house?',
              reveal=f'<b>51 toothpicks.</b> The first house takes 6. Every house after that shares a wall, so it only adds 5: {T(r"6+9\times5=51")}.'),
    extra_expl=['tableDiffs', 'sortVars', 'causeEffect'],
    extra_with_prev=['streetCount'],
    practice=dict(after='ex3', qs='1–7', rest='8–13', line='Patterns, tables of values, and independent or dependent.',
                  chips=[('1–2', 'Vocabulary and review'), ('3–5', 'Patterns and tables'), ('6–7', 'Independent and dependent')],
                  note='We carry on when most of the class has reached Question 6.'),
)
MACH = lambda rows: '<div class="vw-mach">' + ''.join(f'<div><span>{a}</span><i>→</i><span class="{("q" if b == "?" else "")}">{b}</span></div>' for a, b in rows) + '</div>'
SPECS['u5l3'] = dict(
    warm=dict(title='The Mystery Machine', rule='A number goes in, the machine does something to it, and a number comes out. What comes out when <b>10</b> goes in?',
              body=MACH([('1', '4'), ('2', '7'), ('5', '16'), ('10', '?')]),
              nudge='What is the machine doing to each number?',
              reveal=f'<b>31.</b> The machine multiplies by 3, then adds 1: {T(r"3\times10+1=31")}.'),
    extra_cards=['s4b'],
    extra_expl=['plotPairs', 'threeViews', 'tableRead'],
    practice=dict(after='ex3', qs='1–6', rest='7–13', line='Ordered pairs, tables of values and mapping diagrams.',
                  chips=[('1–4', 'Ordered pairs and tables'), ('5–6', 'Mapping diagrams')],
                  note='We carry on when most of the class has reached Question 5.'),
)

SPECS['u5l4'] = dict(
    warm=dict(title='Low Battery!', rule='You both start right now. Whose phone dies first?',
              body='<div class="vw-tiles" style="--n:2"><div><b>You</b><span>80%<small>texting: loses <b>10%</b> every hour</small></span></div><div><b>Jordan</b><span>100%<small>streaming video: loses <b>20%</b> every hour</small></span></div></div>',
              nudge='How long does each phone last?',
              reveal='<b>Jordan’s dies first,</b> after 5 hours (100 ÷ 20). Yours lasts 8 hours (80 ÷ 10), even though it started lower.'),
    extra_expl=['axisZero', 'meetAxes', 'countMeet', 'tableInt', 'readGraph'],
    practice=dict(after='ex34', qs='1–8', rest='9–13', line='Find the intercepts from graphs and from tables.',
                  chips=[('1–5', 'Intercepts from graphs'), ('6–8', 'Intercepts from tables, and key facts')],
                  note='We carry on when most of the class has reached Question 6.'),
)
def stick():
    cell = 46; H = 5 * cell
    ex = f'<line x1="0" y1="{H}" x2="{9*cell}" y2="{H}" stroke="#4a4436" stroke-width="5" stroke-linecap="round"/><line x1="{2*cell}" y1="{H-1*cell}" x2="{6*cell}" y2="{H-4*cell}" stroke="#2b55a0" stroke-width="9" stroke-linecap="round"/>'
    return grid_svg(9, 5, [(4, 5.1, '☀', '#e0a11b')], cell, ex)
SPECS['u5l5'] = dict(
    warm=dict(title='The Shadow', rule='The sun is <b>straight overhead</b>. How long is the shadow of the blue stick on the ground?',
              body=PIC(stick(), 'Each square is 1 unit.'),
              nudge='Is the shadow as long as the stick?',
              reveal='<b>4 units.</b> The shadow runs from under one end of the stick to under the other end. The stick itself is 5 units long, but the shadow only shows how far it reaches left to right.'),
    extra_cards=['s5b'],
    extra_expl=['discrete', 'scan'],
    practice=dict(after='ex4', qs='1–7', rest='8–13', line='Read the domain and range from each graph.',
                  chips=[('1–7', 'Domain and range from a graph')],
                  note='We carry on when most of the class has reached Question 5.'),
)

SPECS['u5l6'] = dict(
    warm=dict(title='Who Gets On?', rule='The sign at the ride says: <b>“You must be at least 120 cm tall, and under 195 cm.”</b> Which of these five people can ride?',
              body='<div class="vw-tiles" style="--n:5"><div><b>A</b>119.5 cm</div><div><b>B</b>120 cm</div><div><b>C</b>150 cm</div><div><b>D</b>194 cm</div><div><b>E</b>195 cm</div></div>',
              
              reveal='<b>B, C and D.</b> “At least 120” includes 120 itself, so B rides. “Under 195” does not include 195, so E can’t.'),
    extra_cards=['s2b'],
    extra_expl=['recall', 'table', 'setNote', 'real'],
    practice=dict(after='ex3', qs='1–8', rest='9–15', line='Domain and range from ordered pairs and tables, then in set notation.',
                  chips=[('1–5', 'Ordered pairs and tables'), ('6–8', 'Set notation and inequalities')],
                  note='We carry on when most of the class has reached Question 6.'),
)
def window_svg(full=False):
    v = '<polyline points="20,20 150,200 280,20" fill="none" stroke="#2b55a0" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
    if full:
        return f'<svg viewBox="0 0 300 220" style="width:220px;flex:none">{v}<rect x="176" y="96" width="70" height="70" fill="rgba(224,161,27,.18)" stroke="#e0a11b" stroke-width="4"/></svg>'
    return '<svg viewBox="170 90 82 82" style="max-width:300px"><defs><clipPath id="vwwin"><rect x="176" y="96" width="70" height="70"/></clipPath></defs><rect x="176" y="96" width="70" height="70" fill="#fbfaf6"/><g clip-path="url(#vwwin)">' + v + '</g><rect x="176" y="96" width="70" height="70" fill="none" stroke="#4a4436" stroke-width="3"/></svg>'
SPECS['u5l7'] = dict(
    warm=dict(title='Through the Window', rule='This is all you can see through a small window. What is the <b>whole picture</b>?',
              body=PIC(window_svg()),
              nudge='How sure are you?',
              reveal='<span style="display:flex;gap:18px;align-items:center">' + window_svg(True) + '<span><b>A big V.</b> The window only showed a small piece of one side, so it looked like a plain straight line. What you see depends on where the window is and how big it is.</span></span>'),
    extra_expl=['keys', 'fixWindow', 'table', 'offEdges', 'context'],
    practice=dict(after='ex4', qs='1–7', rest='8–12', line='Choose a window, then read intercepts, domain and range off the screen.',
                  chips=[('1–3', 'Vocabulary and choosing a window'), ('4–7', 'Intercepts, domain and range off a screen')],
                  note='We carry on when most of the class has reached Question 5.'),
)
VEND = lambda name, rows: f'<div><b>{name}</b><span class="vw-vend">' + ''.join(f'<span>Press <b>{a}</b> → {b}</span>' for a, b in rows) + '</span></div>'
SPECS['u5l8'] = dict(
    warm=dict(title='Which Machine Is Broken?', rule='Two vending machines. One of them is broken. Which one?',
              body='<div class="vw-tiles" style="--n:2">' + VEND('Machine A', [('1', 'chips'), ('2', 'chips'), ('3', 'gum')]) + VEND('Machine B', [('1', 'chips'), ('1', 'gum'), ('2', 'pop')]) + '</div>',
              nudge='What would make you stop trusting a machine?',
              reveal='<b>Machine B.</b> The same button gave two different snacks, so you can’t know what you’ll get. Machine A is fine: two buttons can give the same snack.'),
    extra_cards=['s4b'],
    extra_expl=['arrows', 'pairsCheck', 'families', 'context'],
    practice=dict(after='ex3', qs='1–8', rest='9–15', line='Is it a function? Check the pairs, the tables and the graphs.',
                  chips=[('1–6', 'Is it a function?'), ('7–8', 'The vertical line test')],
                  note='We carry on when most of the class has reached Question 7.'),
)

SPECS['u5l9'] = dict(
    warm=dict(title='Crack the Rule', rule='What is the last one?',
              body=BIG(f'{T(r"f(\text{dog})=3")} &emsp; {T(r"f(\text{horse})=5")} &emsp; {T(r"f(\text{cat})=3")}<small>{T(r"f(\text{elephant})=\ ?")}</small>'),
              nudge='What is the rule doing with each word?',
              reveal=f'<b>8.</b> The rule counts the letters: {T(r"f(\text{elephant})=8")}. The word goes in, a number comes out.'),
    extra_cards=['s2b', 's3b'],
    extra_expl=['anatomy', 'context'],
    practice=dict(after='ex2', qs='1–9', rest='10–16', line='Read the notation, then evaluate for a number.',
                  chips=[('1–3', 'Notation and vocabulary'), ('4–9', 'Evaluating for a number')],
                  note='We carry on when most of the class has reached Question 7.'),
)
SPECS['u5l10'] = dict(
    warm=dict(title='Crack the Code', rule='What is the last one?',
              body=BIG(f'{T(r"h(\text{STOP})=\text{POTS}")} &emsp; {T(r"h(\text{LIVE})=\text{EVIL}")}<small>{T(r"h(\text{DRAW})=\ ?")}</small>'),
              nudge='What does h do to a word?',
              reveal=f'<b>WARD.</b> The rule {T("h")} writes the word backwards.'),
    extra_cards=['s5b', 's5d'],
    extra_expl=['pointLink', 'swap', 'tableFill'],
    practice=dict(after='ex3', qs='1–8', rest='9–15', line='Switch between the two notations, then read values from graphs and tables.',
                  chips=[('1–3', 'Converting between notations'), ('4–8', 'Reading values from graphs and tables')],
                  note='We carry on when most of the class has reached Question 6.'),
)
def battery():
    X = lambda h: 60 + (h - 8) * 40; Y = lambda p: 250 - p * 2.2
    pts = ' '.join(f'{X(h)},{Y(p)}' for h, p in [(8, 100), (15, 40), (17, 90), (22, 20)])
    g = ''.join(f'<line x1="{X(h)}" y1="{Y(0)}" x2="{X(h)}" y2="{Y(100)}" stroke="#e4dfd2" stroke-width="1.5"/><text x="{X(h)}" y="{Y(0)+26}" text-anchor="middle" font-size="17" fill="#6b6557">{lab}</text>' for h, lab in [(8, '8 am'), (10, '10'), (12, 'noon'), (14, '2 pm'), (16, '4'), (18, '6'), (20, '8'), (22, '10 pm')])
    g += ''.join(f'<line x1="{X(8)}" y1="{Y(p)}" x2="{X(22)}" y2="{Y(p)}" stroke="#e4dfd2" stroke-width="1.5"/><text x="{X(8)-10}" y="{Y(p)+6}" text-anchor="end" font-size="17" fill="#6b6557">{p}%</text>' for p in (0, 25, 50, 75, 100))
    return f'<svg viewBox="0 0 660 290" style="max-width:820px">{g}<polyline points="{pts}" fill="none" stroke="#12805a" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></svg>'
def race():
    X = lambda t: 70 + t * 56; Y = lambda d: 250 - d * 2.2
    g = ''.join(f'<line x1="{X(t)}" y1="{Y(0)}" x2="{X(t)}" y2="{Y(100)}" stroke="#e4dfd2" stroke-width="1.5"/><text x="{X(t)}" y="{Y(0)+26}" text-anchor="middle" font-size="17" fill="#6b6557">{t}</text>' for t in range(0, 11, 2))
    g += ''.join(f'<line x1="{X(0)}" y1="{Y(d)}" x2="{X(10)}" y2="{Y(d)}" stroke="#e4dfd2" stroke-width="1.5"/><text x="{X(0)-10}" y="{Y(d)+6}" text-anchor="end" font-size="17" fill="#6b6557">{d} m</text>' for d in (0, 25, 50, 75, 100))
    line = lambda pts, col: f'<polyline points="{" ".join(f"{X(t)},{Y(d)}" for t, d in pts)}" fill="none" stroke="{col}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'
    return f'<svg viewBox="0 0 660 300" style="max-width:820px">{g}<text x="{X(5)}" y="296" text-anchor="middle" font-size="17" fill="#6b6557">time (seconds)</text>{line([(0, 0), (2, 60), (7, 60), (9, 100)], "#c93a33")}{line([(0, 0), (8, 100)], "#12805a")}</svg>'
SPECS['u5l11'] = dict(
    warm=dict(title='The Race', rule='Two runners, one 100 m race. <b>Who won?</b>',
              body=PIC(race(), '<b style="color:#c93a33">Red</b> and <b style="color:#12805a">Green</b>: distance from the start line as time goes by.'),
              nudge='What happened to the other runner?',
              reveal='<b>Green won.</b> Green reaches 100 m after 8 seconds; Red gets there after 9. Red sprinted ahead, then stood still for 5 seconds (the flat part), then ran again.'),
    extra_cards=['ex1c', 'ex2b'],
    extra_expl=['rate', 'shapes'],
    practice=dict(after='ex2', qs='1–5', rest='6–14', line='Read each graph, then match a story to a graph.',
                  chips=[('1–3', 'Reading and interpreting graphs'), ('4–5', 'Matching a story to a graph')],
                  note='We carry on when most of the class has reached Question 4.'),
)
SPECS['u5l12'] = dict(
    warm=dict(title='Where Am I?', rule='A riddle from a point on the grid.',
              body=BIG('“My two coordinates <b>add to 10</b> and <b>multiply to 21</b>.”<small>Where am I?</small>'),
              
              reveal=f'The numbers are 3 and 7. But the point could be {T("(3,\\ 7)")} <b>or</b> {T("(7,\\ 3)")}: two different points, because the order matters.'),
    move_with_warm=['wuex'],
    extra_cards=['s3b', 's5b', 's9b'],
    extra_expl=['plane', 'intercepts', 'screen', 'vlt', 'fwdBack', 'story'],
    replace=[('<span class="muted">(Check them with the Challenge chips in the explainers of Sections 3, 4, 5, 7 and 8.)</span>', '<span class="muted" data-extra>(Check them with the Challenge chips in the explainers of Sections 3, 4, 5, 7 and 8.)</span>')],
    practice=dict(after='ex5', qs='1–11', rest='12–26', line='The first half of the unit, one skill at a time.',
                  chips=[('1–3', 'The Cartesian plane'), ('4–7', 'Patterns and relations'), ('8–11', 'Intercepts, domain and range')],
                  note='We carry on when most of the class has reached Question 8.'),
)
