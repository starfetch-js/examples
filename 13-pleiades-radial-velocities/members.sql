SELECT m."Source" AS dr2_id, m."RV" AS deposited_rv,
  d.source_id AS matched_dr2_id, d.radial_velocity AS rv_dr2_kms
FROM TAP_UPLOAD.members AS m
LEFT OUTER JOIN gaiadr2.gaia_source AS d ON d.source_id = m."Source"
