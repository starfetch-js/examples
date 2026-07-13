SELECT TOP 50
  source_id,
  ra,
  dec,
  pmra,
  pmdec,
  pm AS total_pm,
  phot_g_mean_mag,
  bp_rp
FROM gaiadr3.gaia_source
WHERE pm > 1000
ORDER BY pm DESC
