package com.example.service

import com.example.data.SurveyConstants
import com.example.model.AreaPoint
import com.example.model.LandAreaResult
import java.util.Locale
import kotlin.math.abs
import kotlin.math.floor
import kotlin.math.hypot

object AreaEngine {

    /**
     * Calculates enclosed area and perimeter of a polygon using the Shoelace formula (Gauss's area formula).
     * Points must be ordered sequentially (clockwise or counter-clockwise).
     */
    fun calculatePolygonArea(points: List<AreaPoint>): LandAreaResult {
        if (points.size < 3) {
            return fromSqMeters(0.0, 0.0)
        }

        val n = points.size
        var shoelaceSum = 0.0
        var perimeter = 0.0

        for (i in 0 until n) {
            val j = (i + 1) % n
            val p1 = points[i]
            val p2 = points[j]

            shoelaceSum += (p1.x * p2.y) - (p2.x * p1.y)
            perimeter += hypot(p2.x - p1.x, p2.y - p1.y)
        }

        val areaSqMeters = abs(shoelaceSum) * 0.5
        return fromSqMeters(areaSqMeters, perimeter)
    }

    /**
     * Convert from square meters to all cadastral and survey systems
     */
    fun fromSqMeters(sqM: Double, perimeterMeters: Double = 0.0): LandAreaResult {
        val safeSqM = if (sqM < 0) 0.0 else sqM
        val sqFt = safeSqM * SurveyConstants.SQM_TO_SQFT
        val perimeterFt = perimeterMeters * SurveyConstants.METERS_TO_FEET
        return decomposeArea(safeSqM, sqFt, perimeterMeters, perimeterFt)
    }

    /**
     * Convert from square feet to all systems
     */
    fun fromSqFeet(sqFt: Double): LandAreaResult {
        val safeSqFt = if (sqFt < 0) 0.0 else sqFt
        val sqM = safeSqFt * SurveyConstants.SQFT_TO_SQM
        return decomposeArea(sqM, safeSqFt, 0.0, 0.0)
    }

    /**
     * Convert from Ropani-Aana-Paisa-Daam subunits
     */
    fun fromRopaniSubunits(r: Double, a: Double, p: Double, d: Double): LandAreaResult {
        val totalSqFt = (r * SurveyConstants.SQFT_PER_ROPANI) +
                (a * SurveyConstants.SQFT_PER_AANA) +
                (p * SurveyConstants.SQFT_PER_PAISA) +
                (d * SurveyConstants.SQFT_PER_DAAM)
        val sqM = totalSqFt * SurveyConstants.SQFT_TO_SQM
        return decomposeArea(sqM, totalSqFt, 0.0, 0.0)
    }

    /**
     * Convert from Bigha-Kattha-Dhur subunits
     */
    fun fromBighaSubunits(b: Double, k: Double, dh: Double): LandAreaResult {
        val totalSqFt = (b * SurveyConstants.SQFT_PER_BIGHA) +
                (k * SurveyConstants.SQFT_PER_KATTHA) +
                (dh * SurveyConstants.SQFT_PER_DHUR)
        val sqM = totalSqFt * SurveyConstants.SQFT_TO_SQM
        return decomposeArea(sqM, totalSqFt, 0.0, 0.0)
    }

    private fun decomposeArea(sqM: Double, sqFt: Double, perimeterMeters: Double, perimeterFeet: Double): LandAreaResult {
        // Bigha System decomposition
        val decimalBigha = sqFt / SurveyConstants.SQFT_PER_BIGHA
        val bighaInt = floor(decimalBigha).toLong()
        val remB1 = sqFt - (bighaInt * SurveyConstants.SQFT_PER_BIGHA)

        val decimalKattha = remB1 / SurveyConstants.SQFT_PER_KATTHA
        val katthaInt = floor(decimalKattha).toLong()
        val remB2 = remB1 - (katthaInt * SurveyConstants.SQFT_PER_KATTHA)

        val dhurDouble = remB2 / SurveyConstants.SQFT_PER_DHUR
        val bkdFormatted = String.format(Locale.US, "%d Bigha, %d Kattha, %.2f Dhur", bighaInt, katthaInt, dhurDouble)

        // Ropani System decomposition
        val decimalRopani = sqFt / SurveyConstants.SQFT_PER_ROPANI
        val ropaniInt = floor(decimalRopani).toLong()
        val remR1 = sqFt - (ropaniInt * SurveyConstants.SQFT_PER_ROPANI)

        val decimalAana = remR1 / SurveyConstants.SQFT_PER_AANA
        val aanaInt = floor(decimalAana).toLong()
        val remR2 = remR1 - (aanaInt * SurveyConstants.SQFT_PER_AANA)

        val decimalPaisa = remR2 / SurveyConstants.SQFT_PER_PAISA
        val paisaInt = floor(decimalPaisa).toLong()
        val remR3 = remR2 - (paisaInt * SurveyConstants.SQFT_PER_PAISA)

        val daamDouble = remR3 / SurveyConstants.SQFT_PER_DAAM
        val rapdFormatted = String.format(
            Locale.US,
            "%d Ropani, %d Aana, %d Paisa, %.2f Daam",
            ropaniInt,
            aanaInt,
            paisaInt,
            daamDouble
        )

        val hectares = sqM / SurveyConstants.SQM_PER_HECTARE
        val acres = sqFt / SurveyConstants.SQFT_PER_ACRE

        return LandAreaResult(
            sqMeters = sqM,
            sqFeet = sqFt,
            perimeterMeters = perimeterMeters,
            perimeterFeet = perimeterFeet,
            decimalBigha = decimalBigha,
            bighaInt = bighaInt,
            katthaInt = katthaInt,
            dhurDouble = dhurDouble,
            bkdFormatted = bkdFormatted,
            decimalRopani = decimalRopani,
            ropaniInt = ropaniInt,
            aanaInt = aanaInt,
            paisaInt = paisaInt,
            daamDouble = daamDouble,
            rapdFormatted = rapdFormatted,
            hectares = hectares,
            acres = acres
        )
    }
}
