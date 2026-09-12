package com.example.service

import com.example.model.AdjustmentRule
import com.example.model.DmsAngle
import com.example.model.TraverseComputedRow
import com.example.model.TraverseInputRow
import com.example.model.TraverseSummary
import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.roundToLong
import kotlin.math.sin
import kotlin.math.sqrt

object TraverseEngine {

    fun computeTraverse(
        inputs: List<TraverseInputRow>,
        rule: AdjustmentRule = AdjustmentRule.BOWDITCH,
        startEasting: Double = 1000.0,
        startNorthing: Double = 1000.0
    ): Pair<List<TraverseComputedRow>, TraverseSummary?> {
        if (inputs.isEmpty()) return Pair(emptyList(), null)

        val n = inputs.size
        val computedBearings = mutableListOf<DmsAngle>()

        // 1. Bearing propagation
        val initialBearing = inputs[0].initialBearing ?: DmsAngle.ZERO
        computedBearings.add(initialBearing)

        for (i in 1 until n) {
            val prevBearingDeg = computedBearings[i - 1].decimalDegrees
            val angleDeg = inputs[i].correctedAngle.decimalDegrees
            // Forward azimuth = (Previous Azimuth + 180 + Clockwise Angle) % 360
            var nextBearingDeg = (prevBearingDeg + 180.0 + angleDeg) % 360.0
            if (nextBearingDeg < 0.0) nextBearingDeg += 360.0
            computedBearings.add(DmsAngle.fromDecimal(nextBearingDeg))
        }

        // 2. Raw Departure (ΔE) and Latitude (ΔN)
        val rawDeltaE = mutableListOf<Double>()
        val rawDeltaN = mutableListOf<Double>()
        var totalDistance = 0.0

        for (i in 0 until n) {
            val dist = inputs[i].distance
            totalDistance += dist
            val bearingRad = computedBearings[i].radians
            val de = dist * sin(bearingRad)
            val dn = dist * cos(bearingRad)
            rawDeltaE.add(de)
            rawDeltaN.add(dn)
        }

        val sumDeltaE = rawDeltaE.sum()
        val sumDeltaN = rawDeltaN.sum()
        val sumAbsDeltaE = rawDeltaE.sumOf { abs(it) }
        val sumAbsDeltaN = rawDeltaN.sumOf { abs(it) }

        val linearMisclosure = sqrt(sumDeltaE * sumDeltaE + sumDeltaN * sumDeltaN)
        val relativeDenominator = if (linearMisclosure > 1e-7 && totalDistance > 0.0) {
            (totalDistance / linearMisclosure).roundToLong()
        } else {
            0L
        }

        var misclosureRad = atan2(sumDeltaE, sumDeltaN)
        if (misclosureRad < 0) misclosureRad += 2 * Math.PI
        val misclosureBearing = DmsAngle.fromRadians(misclosureRad)

        // 3. Balancing Corrections
        val corrDeltaE = mutableListOf<Double>()
        val corrDeltaN = mutableListOf<Double>()

        for (i in 0 until n) {
            val cE: Double
            val cN: Double
            when (rule) {
                AdjustmentRule.BOWDITCH -> {
                    if (totalDistance > 0.0) {
                        cE = -sumDeltaE * (inputs[i].distance / totalDistance)
                        cN = -sumDeltaN * (inputs[i].distance / totalDistance)
                    } else {
                        cE = 0.0
                        cN = 0.0
                    }
                }
                AdjustmentRule.TRANSIT -> {
                    cE = if (sumAbsDeltaE > 1e-7) -sumDeltaE * (abs(rawDeltaE[i]) / sumAbsDeltaE) else 0.0
                    cN = if (sumAbsDeltaN > 1e-7) -sumDeltaN * (abs(rawDeltaN[i]) / sumAbsDeltaN) else 0.0
                }
            }
            corrDeltaE.add(cE)
            corrDeltaN.add(cN)
        }

        // 4. Coordinates calculation
        val rows = mutableListOf<TraverseComputedRow>()
        var currentE = startEasting
        var currentN = startNorthing

        var sumCorrDE = 0.0
        var sumCorrDN = 0.0

        for (i in 0 until n) {
            val finalDE = rawDeltaE[i] + corrDeltaE[i]
            val finalDN = rawDeltaN[i] + corrDeltaN[i]
            sumCorrDE += finalDE
            sumCorrDN += finalDN

            currentE += finalDE
            currentN += finalDN

            rows.add(
                TraverseComputedRow(
                    sn = i + 1,
                    station = inputs[i].station,
                    correctedAngle = inputs[i].correctedAngle,
                    line = inputs[i].line,
                    bearing = computedBearings[i],
                    distance = inputs[i].distance,
                    deltaE = rawDeltaE[i],
                    deltaN = rawDeltaN[i],
                    correctionDeltaE = corrDeltaE[i],
                    correctionDeltaN = corrDeltaN[i],
                    correctedDeltaE = finalDE,
                    correctedDeltaN = finalDN,
                    correctedEasting = currentE,
                    correctedNorthing = currentN
                )
            )
        }

        val summary = TraverseSummary(
            totalPerimeter = totalDistance,
            sumDeltaE = sumDeltaE,
            sumDeltaN = sumDeltaN,
            sumCorrectedDeltaE = sumCorrDE,
            sumCorrectedDeltaN = sumCorrDN,
            linearMisclosure = linearMisclosure,
            relativePrecisionDenominator = relativeDenominator,
            misclosureBearing = misclosureBearing,
            adjustmentRule = rule
        )

        return Pair(rows, summary)
    }

    // Standard high-quality sample traverse dataset for initial demonstration
    fun getSampleTraverse(): List<TraverseInputRow> {
        return listOf(
            TraverseInputRow(
                station = "A",
                line = "A-B",
                correctedAngle = DmsAngle(88, 14, 20.0),
                distance = 125.40,
                initialBearing = DmsAngle(42, 30, 0.0) // Initial bearing of A-B
            ),
            TraverseInputRow(
                station = "B",
                line = "B-C",
                correctedAngle = DmsAngle(92, 45, 10.0),
                distance = 158.20
            ),
            TraverseInputRow(
                station = "C",
                line = "C-D",
                correctedAngle = DmsAngle(89, 10, 40.0),
                distance = 110.80
            ),
            TraverseInputRow(
                station = "D",
                line = "D-E",
                correctedAngle = DmsAngle(94, 20, 30.0),
                distance = 142.50
            ),
            TraverseInputRow(
                station = "E",
                line = "E-A",
                correctedAngle = DmsAngle(175, 29, 20.0),
                distance = 64.15
            )
        )
    }
}
