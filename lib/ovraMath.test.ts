import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSheetUrl,
  COLLAGE_INNER_URL,
  MARQUEE_INNER_URL,
  CELLS,
  SHEET_DIMENSIONS,
  computeCropStyle,
  computeStencilMask,
  computeWordSpacing,
  computeMarqueeOffsets,
  cubicBezier,
} from './ovraMath';

test('buildSheetUrl generates exact Higgs proxy URLs', () => {
  const collageUrl = buildSheetUrl(COLLAGE_INNER_URL, 2048);
  assert.equal(
    collageUrl,
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261114_120327_e42374b9-471e-4799-9dca-07fe8b4d6536.png&w=2048&q=85'
  );
  const marqueeUrl = buildSheetUrl(MARQUEE_INNER_URL, 1744);
  assert.equal(
    marqueeUrl,
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261114_120324_90c4bb35-2fb2-47a8-aa6e-14a7c92e2214.png&w=1744&q=85'
  );
});

test('computeCropStyle calculates exact cover scale and focal positioning', () => {
  // Centre card: 380 x 534 on 982 x 982 cell inside 2048 x 2048 sheet
  const res = computeCropStyle(
    380,
    534,
    SHEET_DIMENSIONS.collage.w,
    SHEET_DIMENSIONS.collage.h,
    CELLS.collageCentre
  );
  const expectedScale = 534 / 982;
  assert.ok(Math.abs(res.scale - expectedScale) < 1e-9);
  assert.equal(
    res.backgroundSize,
    `${2048 * expectedScale}px ${2048 * expectedScale}px`
  );
  const expectedX = -(29 * expectedScale) - (982 * expectedScale - 380) * 0.5;
  const expectedY = -(28 * expectedScale) - (982 * expectedScale - 534) * 0.2;
  assert.equal(res.backgroundPositionX, `${expectedX}px`);
  assert.equal(res.backgroundPositionY, `${expectedY}px`);

  // Marquee look 1: 503 x 699 on 866 x 1159 cell inside 1744 x 2336 sheet, focal (0.5, 1)
  const m1 = computeCropStyle(
    503,
    699,
    SHEET_DIMENSIONS.marquee.w,
    SHEET_DIMENSIONS.marquee.h,
    CELLS.marquee1
  );
  const mScale = Math.max(503 / 866, 699 / 1159);
  assert.ok(Math.abs(m1.scale - mScale) < 1e-9);
  assert.equal(m1.backgroundPositionY, `${-(1159 * mScale - 699)}px`);
});

test('computeStencilMask generates expected direction and gap for characters', () => {
  const tMask = computeStencilMask('T');
  assert.ok(tMask?.includes('linear-gradient(180deg'));
  assert.ok(tMask?.includes('21%'));
  const wMask = computeStencilMask('W');
  assert.ok(wMask?.includes('linear-gradient(90deg'));
  assert.ok(wMask?.includes('50%'));
  const aMask = computeStencilMask('A');
  assert.ok(aMask?.includes('linear-gradient(180deg'));
  assert.ok(aMask?.includes('62%'));
  assert.equal(computeStencilMask('!'), null);
});

test('computeWordSpacing fits WORKOUT to target span', () => {
  assert.equal(computeWordSpacing(1384, 1204, 6), 30);
});

test('computeMarqueeOffsets moves row 1 right and row 2 left on scroll down', () => {
  const start = computeMarqueeOffsets(0, 0, 1000, 1);
  assert.equal(start.row1X, -1006);
  assert.equal(start.row2X, -6);

  // Scrolling down makes sectionTop negative -> d increases
  const scrolled = computeMarqueeOffsets(-200, 0, 1000, 1);
  // d = 90 -> row1 moves right (+90), row2 moves left (-90)
  assert.equal(scrolled.row1X, -916);
  assert.equal(scrolled.row2X, -96);
});

test('cubicBezier respects endpoints and monotonicity', () => {
  const ease = cubicBezier(0.3, 0, 0.2, 1);
  assert.equal(ease(0), 0);
  assert.equal(ease(1), 1);
  assert.ok(ease(0.5) > 0.5);
  assert.ok(ease(0.25) < ease(0.75));
});
