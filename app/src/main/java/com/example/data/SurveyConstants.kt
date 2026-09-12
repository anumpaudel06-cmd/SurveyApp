package com.example.data

/**
 * Standard cadastral and survey constants based on official Nepal Survey Department
 * (Department of Survey, GoN) and International System of Units (SI / NIST standard: 1 ft = 0.3048 m exact).
 */
object SurveyConstants {
    // Exact Linear standards (International standard treaty: 1 foot = 0.3048 meters exact)
    const val METERS_TO_FEET = 1.0 / 0.3048 // 3.280839895013123...
    const val FEET_TO_METERS = 0.3048
    const val FEET_TO_INCHES = 12.0
    const val FEET_TO_YARDS = 1.0 / 3.0
    const val FEET_TO_CHAINS = 1.0 / 66.0   // Gunter's survey chain = 66 ft = 4 rods
    const val FEET_TO_LINKS = 100.0 / 66.0  // 1 chain = 100 links -> 1 link = 0.66 ft = 7.92 in

    // Area conversion constants (Exact SI standards)
    const val SQFT_TO_SQM = 0.3048 * 0.3048 // Exact 0.09290304 m² per sq ft
    const val SQM_TO_SQFT = 1.0 / SQFT_TO_SQM // 10.763910416709722... sq ft per m²

    // Bigha System (Terai Region, Nepal Survey Standard)
    // 1 Bigha = 20 Kattha = 400 Dhur = 72,900 sq ft (270 ft × 270 ft)
    const val SQFT_PER_BIGHA = 72900.0
    const val SQFT_PER_KATTHA = 3645.0 // 72900 / 20
    const val SQFT_PER_DHUR = 182.25   // 3645 / 20
    const val SQFT_PER_KANWA = 45.5625 // 182.25 / 4

    // Metric equivalent derived from exact standard (0.09290304 m²/sq.ft)
    const val SQM_PER_BIGHA = SQFT_PER_BIGHA * SQFT_TO_SQM   // 6772.631616 m²
    const val SQM_PER_KATTHA = SQFT_PER_KATTHA * SQFT_TO_SQM // 338.6315808 m²
    const val SQM_PER_DHUR = SQFT_PER_DHUR * SQFT_TO_SQM     // 16.93157904 m²

    const val KATTHA_PER_BIGHA = 20
    const val DHUR_PER_KATTHA = 20
    const val KANWA_PER_DHUR = 4

    // Ropani System (Hilly Region, Nepal Survey Standard)
    // 1 Ropani = 16 Aana = 64 Paisa = 256 Daam = 5,476 sq ft (74 ft × 74 ft)
    const val SQFT_PER_ROPANI = 5476.0
    const val SQFT_PER_AANA = 342.25   // 5476 / 16
    const val SQFT_PER_PAISA = 85.5625 // 342.25 / 4
    const val SQFT_PER_DAAM = 21.390625 // 85.5625 / 4

    // Metric equivalent derived from exact standard (0.09290304 m²/sq.ft)
    const val SQM_PER_ROPANI = SQFT_PER_ROPANI * SQFT_TO_SQM // 508.73704704 m²
    const val SQM_PER_AANA = SQFT_PER_AANA * SQFT_TO_SQM     // 31.79606544 m²
    const val SQM_PER_PAISA = SQFT_PER_PAISA * SQFT_TO_SQM   // 7.94901636 m²
    const val SQM_PER_DAAM = SQFT_PER_DAAM * SQFT_TO_SQM     // 1.98725409 m²

    const val AANA_PER_ROPANI = 16
    const val PAISA_PER_AANA = 4
    const val DAAM_PER_PAISA = 4

    // Exact Cross-System Interconversions
    const val ROPANI_TO_BIGHA = SQFT_PER_ROPANI / SQFT_PER_BIGHA // 5476 / 72900 = 0.07511659807956104
    const val BIGHA_TO_ROPANI = SQFT_PER_BIGHA / SQFT_PER_ROPANI // 72900 / 5476 = 13.31263696128561

    // International Standard Land Area Units
    const val SQFT_PER_ACRE = 43560.0                     // Exact 43,560 sq ft
    const val SQM_PER_ACRE = SQFT_PER_ACRE * SQFT_TO_SQM   // 4046.8564224 m²
    const val SQM_PER_HECTARE = 10000.0                    // Exact 10,000 m²
    const val SQFT_PER_HECTARE = SQM_PER_HECTARE * SQM_TO_SQFT // 107639.10416709722 sq ft
    const val SQFT_PER_GUNTHA = 1089.0                    // 33 ft × 33 ft = 1/40 acre
    const val SQFT_PER_SQ_YARD = 9.0

    // Angular equivalents
    // 400g = 360° = 24 hrs = 2π rad = 6400 mils
    const val GRADS_PER_CIRCLE = 400.0
    const val DEGREES_PER_CIRCLE = 360.0
    const val HOURS_PER_CIRCLE = 24.0
    const val MILS_PER_CIRCLE = 6400.0
}
