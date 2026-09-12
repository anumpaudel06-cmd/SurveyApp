package com.example.model

enum class AdjustmentRule(val displayName: String, val ruleDescription: String) {
    BOWDITCH("Bowditch / Compass Rule", "Corrections proportional to line length / total perimeter"),
    TRANSIT("Transit Rule", "Corrections proportional to latitude/departure components")
}

data class TraverseInputRow(
    val id: String = java.util.UUID.randomUUID().toString(),
    val station: String,
    val line: String,
    val correctedAngle: DmsAngle,
    val distance: Double,
    val initialBearing: DmsAngle? = null
)

data class TraverseComputedRow(
    val sn: Int,
    val station: String,
    val correctedAngle: DmsAngle,
    val line: String,
    val bearing: DmsAngle,
    val distance: Double,
    val deltaE: Double,              // Departure
    val deltaN: Double,              // Latitude
    val correctionDeltaE: Double,    // Applied correction to Easting
    val correctionDeltaN: Double,    // Applied correction to Northing
    val correctedDeltaE: Double,     // Final corrected Departure
    val correctedDeltaN: Double,     // Final corrected Latitude
    val correctedEasting: Double,    // Final Easting coordinate
    val correctedNorthing: Double    // Final Northing coordinate
)

data class TraverseSummary(
    val totalPerimeter: Double,
    val sumDeltaE: Double,
    val sumDeltaN: Double,
    val sumCorrectedDeltaE: Double,
    val sumCorrectedDeltaN: Double,
    val linearMisclosure: Double,
    val relativePrecisionDenominator: Long,
    val misclosureBearing: DmsAngle,
    val adjustmentRule: AdjustmentRule
)
