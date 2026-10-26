/* Site settings.
 * inkApi: the /exec URL of the Apps Script in backend/Code.gs. Empty = live sharing is off and every device can write
 * (ink is only saved on that device). Once it's set, only a device signed in with the teacher key can write; everyone
 * else sees the teacher's notes for their class link (?class=B), view only. */
export const CONFIG = {
  inkApi: 'https://script.google.com/macros/s/AKfycbyEs9QsiHa31uY-7exGb6TCSbcYQ6vw4_kXY0KT54-LVCRmVRTpS09Gm2lfvfiEfys/exec',
  classes: ['A', 'B', 'C', 'D'],
  classLabel: (c) => (/^[A-D]$/.test(c) ? 'Block ' + c : c)
};
