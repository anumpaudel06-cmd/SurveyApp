package com.example.model

import com.example.data.SurveyConstants

enum class UnitCategory {
    LENGTH,
    AREA
}

/**
 * Standard survey unit with exact conversion factor to base SI unit (Meters for Length, Sq.Meters for Area).
 */
data class SurveyUnit(
    val id: String,
    val name: String,
    val symbol: String,
    val category: UnitCategory,
    val toBaseFactor: Double // Base is Meter (for length) or Sq.Meter (for area)
) {
    companion object {
        val LENGTH_UNITS = listOf(
            SurveyUnit("m", "Meter", "m", UnitCategory.LENGTH, 1.0),
            SurveyUnit("ft", "Feet", "ft", UnitCategory.LENGTH, SurveyConstants.FEET_TO_METERS),
            SurveyUnit("in", "Inches", "in", UnitCategory.LENGTH, 0.0254),
            SurveyUnit("cm", "Centimeter", "cm", UnitCategory.LENGTH, 0.01),
            SurveyUnit("yd", "Yard", "yd", UnitCategory.LENGTH, 0.9144),
            SurveyUnit("ch", "Chain (Gunter)", "ch", UnitCategory.LENGTH, 66.0 * SurveyConstants.FEET_TO_METERS), // 20.1168 m
            SurveyUnit("li", "Link (Survey)", "li", UnitCategory.LENGTH, 0.66 * SurveyConstants.FEET_TO_METERS),  // 0.201168 m
            SurveyUnit("km", "Kilometer", "km", UnitCategory.LENGTH, 1000.0),
            SurveyUnit("mi", "Mile", "mi", UnitCategory.LENGTH, 1609.344),
            SurveyUnit("haath", "Haath (Nepal)", "haath", UnitCategory.LENGTH, 1.5 * SurveyConstants.FEET_TO_METERS), // 0.4572 m
            SurveyUnit("danda", "Danda (Nepal)", "danda", UnitCategory.LENGTH, 6.0 * SurveyConstants.FEET_TO_METERS)  // 1.8288 m
        )

        val AREA_UNITS = listOf(
            SurveyUnit("sqm", "Square Meter", "sq.m", UnitCategory.AREA, 1.0),
            SurveyUnit("sqft", "Square Feet", "sq.ft", UnitCategory.AREA, SurveyConstants.SQFT_TO_SQM),
            // Nepal Ropani System
            SurveyUnit("ropani", "Ropani", "Ropani", UnitCategory.AREA, SurveyConstants.SQM_PER_ROPANI),
            SurveyUnit("aana", "Aana", "Aana", UnitCategory.AREA, SurveyConstants.SQM_PER_AANA),
            SurveyUnit("paisa", "Paisa", "Paisa", UnitCategory.AREA, SurveyConstants.SQM_PER_PAISA),
            SurveyUnit("daam", "Daam", "Daam", UnitCategory.AREA, SurveyConstants.SQM_PER_DAAM),
            // Nepal Bigha System
            SurveyUnit("bigha", "Bigha", "Bigha", UnitCategory.AREA, SurveyConstants.SQM_PER_BIGHA),
            SurveyUnit("kattha", "Kattha", "Kattha", UnitCategory.AREA, SurveyConstants.SQM_PER_KATTHA),
            SurveyUnit("dhur", "Dhur", "Dhur", UnitCategory.AREA, SurveyConstants.SQM_PER_DHUR),
            SurveyUnit("kanwa", "Kanwa", "Kanwa", UnitCategory.AREA, SurveyConstants.SQFT_PER_KANWA * SurveyConstants.SQFT_TO_SQM),
            // International standards
            SurveyUnit("acre", "Acre", "acre", UnitCategory.AREA, SurveyConstants.SQM_PER_ACRE),
            SurveyUnit("ha", "Hectare", "ha", UnitCategory.AREA, SurveyConstants.SQM_PER_HECTARE),
            SurveyUnit("sqyd", "Square Yard", "sq.yd", UnitCategory.AREA, 9.0 * SurveyConstants.SQFT_TO_SQM),
            SurveyUnit("guntha", "Guntha", "guntha", UnitCategory.AREA, SurveyConstants.SQFT_PER_GUNTHA * SurveyConstants.SQFT_TO_SQM)
        )

        fun convert(value: Double, from: SurveyUnit, to: SurveyUnit): Double {
            if (from.category != to.category) return 0.0
            val baseValue = value * from.toBaseFactor
            return baseValue / to.toBaseFactor
        }
    }
}
