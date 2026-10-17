# Core No.37 / Xerophyte — narration overlap production fix

Author requested the same behavior as the published Carriage Window and authorized publication.

Both production HTML pages were missing `h53-reading-layout-v2-20261017.js`, while the preview pages already loaded it. Add that same shared controller to the two root pages. It hides narration (`#log`), phase and surrounding controls while a reading panel is open, and restores visibility after closing. Art rendering and narration content are unchanged.

Validation on the root production paths: 390×844, 844×390 and 320×568. Trigger each work's narrative event, tap an actual ID-map observation target, verify the reading title remains visible and narration/phase become hidden, then close and verify narration visibility returns. Both works passed all three sizes without JavaScript errors. Independent archive verification also passed: separately extracted ZIP, HTTP port 8035, actual target taps and narration restoration at 390×844 in both works, with no failed resources or JavaScript errors. Archive CRC passed; 517,188,585 bytes, 1,037 entries; source `b8c2dc24e45b3a207ebc0a718c8e926cc1e07c66`, SHA-256 `81626b6d2a24794b8735f53ee375f758ed398c00ace06eaae880bc22d6599d02`. Remote Pages delivery remains unverified because this environment cannot access the Pages host.
