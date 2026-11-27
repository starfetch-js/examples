SELECT t.dr2_id, t.matched_dr2_id, t.deposited_rv, t.rv_dr2_kms,
  n.dr3_source_id AS dr3_id, g.source_id AS matched_dr3_id,
  g.radial_velocity AS rv_dr3_kms, g.radial_velocity_error AS rv_dr3_error_kms,
  n.angular_distance AS separation_mas, other.dr2_source_id AS competing_dr2_id
FROM TAP_UPLOAD.targets AS t
LEFT OUTER JOIN gaiadr3.dr2_neighbourhood AS n ON n.dr2_source_id = t.dr2_id
LEFT OUTER JOIN gaiadr3.gaia_source AS g ON g.source_id = n.dr3_source_id
LEFT OUTER JOIN gaiadr3.dr2_neighbourhood AS other
  ON other.dr3_source_id = n.dr3_source_id AND other.dr2_source_id <> t.dr2_id
ORDER BY t.dr2_id, n.dr3_source_id, other.dr2_source_id
