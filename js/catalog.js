/* The course: units and lessons in booklet order. A lesson with a lesson file (HW.lessons[id]) is open;
 * the rest show as "coming soon" (with their teaching-site lesson card). The class calendar (js/calendar.js) plans every
 * lesson listed here, plus a unit test after each unit. Titles match the Math 15 booklets. */
(function (root) {
  'use strict';
  root.HW = root.HW || {};
  /* lessons that have a lesson page under lessons/ (examples + the teacher's class notes); the home page and the
   * lesson sidebar link to it as lessons/u1/l7/?class=<block> */
  root.HW.TEACHING = { base: 'lessons/',
    lessons: ['u4l1', 'u4l2', 'u4l3', 'u4l4', 'u4l5', 'u4l6', 'u4l7', 'u4l8', 'u4l9', 'u4l10'] };
  root.HW.CATALOG = [
    { unit: 1, title: 'Number', outcomes: 'AN1 · AN2', lessons: [
      { id: 'u1l1', num: '1', title: 'Review: Integer Operations and Order of Operations' },
      { id: 'u1l2', num: '2', title: 'Review: Operations with Fractions and Decimals' },
      { id: 'u1l3', num: '3', title: 'Prime Factorization, GCF, and LCM' },
      { id: 'u1l4', num: '4', title: 'Classifying Numbers in the Real Number System' },
      { id: 'u1l5', num: '5', title: 'Perfect Squares, Perfect Cubes, and Estimating Roots' },
      { id: 'u1l6', num: '6', title: 'Simplifying Square Roots: Entire and Mixed Radicals' },
      { id: 'u1l7', num: '7', title: 'Simplifying Higher-Index Radicals' },
      { id: 'u1l8', num: '8', title: 'Unit Review: Number Sense' }] },
    { unit: 2, title: 'Exponents', outcomes: 'AN3', lessons: [
      { id: 'u2l1', num: '1', title: 'Powers, Exponent Vocabulary & the Product Law' },
      { id: 'u2l2', num: '2', title: 'The Quotient Law & Power of a Power' },
      { id: 'u2l3', num: '3', title: 'Power of a Product and Power of a Quotient' },
      { id: 'u2l4', num: '4', title: 'Combining Exponent Laws' },
      { id: 'u2l5', num: '5', title: 'Zero Exponents' },
      { id: 'u2l6', num: '6', title: 'Negative Exponents' },
      { id: 'u2l7', num: '7', title: 'Combining Zero, Negative and Positive Exponents' },
      { id: 'u2l8', num: '8', title: 'Scientific Notation' },
      { id: 'u2l9', num: '9', title: 'Rational Exponents and Radical Form' },
      { id: 'u2l10', num: '10', title: 'Unit Review: Exponents' }] },
    { unit: 3, title: 'Polynomial Operations', outcomes: 'AN4', lessons: [
      { id: 'u3l1', num: '1', title: 'Like Terms, and Adding/Subtracting Polynomials' },
      { id: 'u3l2', num: '2', title: 'Multiplying a Monomial by a Polynomial' },
      { id: 'u3l3', num: '3', title: 'Multiplying Two Binomials' },
      { id: 'u3l4', num: '4', title: 'Special Products: Difference of Squares & Perfect Squares' },
      { id: 'u3l5', num: '5', title: 'Multiplying a Binomial by a Trinomial' },
      { id: 'u3l6', num: '6', title: 'Applying Polynomial Products to Area, Volume, and Equations' },
      { id: 'u3l7', num: '7', title: 'Unit Review: Polynomial Operations' }] },
    { unit: 4, title: 'Factoring Polynomial Expressions', outcomes: 'AN5', lessons: [
      { id: 'u4l1', num: '1', title: 'Multiplying and Factoring: The Reverse Relationship' },
      { id: 'u4l2', num: '2', title: 'Common Factors: Finding and Removing the GCF' },
      { id: 'u4l3', num: '3', title: 'Factoring Trinomials x² + bx + c, Part 1: c Positive' },
      { id: 'u4l4', num: '4', title: 'Factoring Trinomials x² + bx + c, Part 2: c Negative' },
      { id: 'u4l5', num: '5', title: 'Factoring the Difference of Squares' },
      { id: 'u4l6', num: '6', title: 'Factoring Perfect Square Trinomials' },
      { id: 'u4l7', num: '7', title: 'Factoring ax² + bx + c (where a ≠ 1)' },
      { id: 'u4l8', num: '8', title: 'Choosing a Factoring Strategy' },
      { id: 'u4l9', num: '9', title: 'Solving Polynomial Equations by Factoring' },
      { id: 'u4l10', num: '10', title: 'Unit Review: Factoring' }] },
    { unit: 5, title: 'Relations and Functions', outcomes: 'RF1 · RF2 · RF4 · RF5 · RF8', lessons: [
      { id: 'u5l1', num: '1', title: 'The Cartesian Plane and Plotting Points' },
      { id: 'u5l2', num: '2', title: 'Growing Patterns and Types of Variables' },
      { id: 'u5l3', num: '3', title: 'Describing Relationships Between Two Quantities' },
      { id: 'u5l4', num: '4', title: 'Where Graphs Meet the Axes: x- and y-Intercepts' },
      { id: 'u5l5', num: '5', title: 'Domain and Range of a Relation, Part 1: Reading From a Graph' },
      { id: 'u5l6', num: '6', title: 'Domain and Range of a Relation, Part 2' },
      { id: 'u5l7', num: '7', title: 'Using Technology to Graph and Explore Relations' },
      { id: 'u5l8', num: '8', title: 'Introducing Functions: The Vertical Line Test' },
      { id: 'u5l9', num: '9', title: 'Function Notation: Evaluating and Interpreting f(x)' },
      { id: 'u5l10', num: '10', title: 'Function Notation: Graphs, Conversions, and Real-World Models' },
      { id: 'u5l11', num: '11', title: 'Interpreting and Sketching Real-World Graphs' },
      { id: 'u5l12', num: '12', title: 'Unit Review: Relations and Functions' }] },
    { unit: 6, title: 'Characteristics of Linear Relations', outcomes: 'RF3', lessons: [
      { id: 'u6l1', num: '1', title: 'Review: The Pythagorean Theorem' },
      { id: 'u6l2', num: '2', title: 'Measuring the Length of a Line Segment' },
      { id: 'u6l3', num: '3', title: 'The Distance Formula: Diagonal Segments' },
      { id: 'u6l4', num: '4', title: 'The Midpoint Formula' },
      { id: 'u6l5', num: '5', title: 'Applications: Distance, Midpoint, and Finding a Missing Endpoint' },
      { id: 'u6l6', num: '6', title: 'Rise Over Run: The Slope of a Line Segment' },
      { id: 'u6l7', num: '7', title: 'Types of Slope: Positive, Negative, Zero, and Undefined' },
      { id: 'u6l8', num: '8', title: 'Determining Collinearity Using Slope' },
      { id: 'u6l9', num: '9', title: 'Parallel and Perpendicular Lines' },
      { id: 'u6l10', num: '10', title: 'Unit Review: Coordinate Geometry' }] },
    { unit: 7, title: 'Equations of Linear Relations', outcomes: 'RF3 · RF4 · RF5 · RF6 · RF7', lessons: [
      { id: 'u7l1', num: '1', title: 'Review: Graphing Linear Equations from a Table of Values' },
      { id: 'u7l2', num: '2', title: 'Slope–Intercept Form: y = mx + b' },
      { id: 'u7l3', num: '3', title: 'Graphing a Line Using Slope–Intercept Form' },
      { id: 'u7l4', num: '4', title: 'Writing the Equation of a Line Given Slope and y-Intercept' },
      { id: 'u7l5', num: '5', title: 'Writing the Equation of a Line Given Slope and a Point' },
      { id: 'u7l6', num: '6', title: 'Writing the Equation of a Line Given Two Points' },
      { id: 'u7l7', num: '7', title: 'The General Form of a Linear Equation' },
      { id: 'u7l8', num: '8', title: 'Graphing Horizontal Lines, Vertical Lines, and Any Form' },
      { id: 'u7l9', num: '9', title: 'Slope in Context: Interpreting Rates of Change' },
      { id: 'u7l10', num: '10', title: 'Unit Review: Equations of Lines' }] },
    { unit: 8, title: 'Systems of Linear Equations', outcomes: 'RF9', lessons: [
      { id: 'u8l1', num: '1', title: 'What Is a System of Linear Equations? Solving by Graphing' },
      { id: 'u8l2', num: '2', title: 'Classifying Systems: One Solution, No Solution, or Infinite Solutions' },
      { id: 'u8l3', num: '3', title: 'Solving Systems by Substitution, Part 1: A Variable Already Isolated' },
      { id: 'u8l4', num: '4', title: 'Solving Systems by Substitution, Part 2: Isolating a Variable First' },
      { id: 'u8l5', num: '5', title: 'Solving Systems by Elimination, Part 1: Coefficients Already Match' },
      { id: 'u8l6', num: '6', title: 'Solving Systems by Elimination, Part 2: Multiplying First' },
      { id: 'u8l7', num: '7', title: 'Solving Word Problems with Systems of Equations' },
      { id: 'u8l8', num: '8', title: 'Unit Review: Systems of Linear Equations' }] }
  ];
  /* a colour for each unit (class calendar, unit headings): neighbouring units contrast, so a unit change is easy to see.
     HW.unitStyle(u) gives CSS variables: --uc (the colour), --ucl (pale tint), --ucs (soft border), --ucd (dark text),
     --uct (solid fill for white text, e.g. a unit test day). */
  var UC = { 1: '#2563eb', 2: '#ea580c', 3: '#7c3aed', 4: '#16a34a', 5: '#db2777', 6: '#0d9488', 7: '#ca8a04', 8: '#4f46e5', 9: '#dc2626', 10: '#8b5e34' };
  function mix(a, b, t) { var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16), out = '#'; [16, 8, 0].forEach(function (s) { var v = Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t); out += ('0' + v.toString(16)).slice(-2); }); return out; }
  root.HW.UNIT_COLORS = UC;
  root.HW.unitColor = function (u) { var c = UC[u] || '#24508f'; return { c: c, light: mix(c, '#ffffff', 0.87), soft: mix(c, '#ffffff', 0.55), dark: mix(c, '#000000', 0.38), solid: mix(c, '#000000', 0.12) }; };
  root.HW.unitStyle = function (u) { var x = root.HW.unitColor(u); return '--uc:' + x.c + ';--ucl:' + x.light + ';--ucs:' + x.soft + ';--ucd:' + x.dark + ';--uct:' + x.solid; };
  root.HW.OUTCOMES = {
    AN1: 'Factors of whole numbers: prime factors, GCF, LCM, square roots and cube roots',
    AN2: 'Irrational numbers: representing, identifying and simplifying; ordering real numbers',
    AN3: 'Powers with integral and rational exponents',
    AN4: 'Multiplication of polynomial expressions',
    AN5: 'Common factors and trinomial factoring',
    RF1: 'Interpreting and explaining relations', RF2: 'Relations and functions', RF3: 'Slope', RF4: 'Linear relations',
    RF5: 'Characteristics of linear relations', RF6: 'Forms of linear equations', RF7: 'Equations of linear relations',
    RF8: 'Function notation', RF9: 'Systems of linear equations', M1: 'SI and imperial measurement', M2: 'Converting units',
    M3: 'Surface area and volume', M4: 'Trigonometry', EXT: 'Extension (not part of a unit level)'
  };
})(window);
