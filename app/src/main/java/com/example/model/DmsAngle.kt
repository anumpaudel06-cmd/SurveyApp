package com.example.model

import java.util.Locale
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.floor
import kotlin.math.roundToLong

data class DmsAngle(
    val degrees: Int = 0,
    val minutes: Int = 0,
    val seconds: Double = 0.0
) {
    val decimalDegrees: Double
        get() {
            val sign = if (degrees < 0) -1.0 else 1.0
            return (abs(degrees).toDouble() + minutes.toDouble() / 60.0 + seconds / 3600.0) * sign
        }

    val radians: Double
        get() = decimalDegrees * PI / 180.0

    fun toFormattedString(includeSymbols: Boolean = true): String {
        val secFormatted = String.format(Locale.US, if (seconds % 1.0 == 0.0) "%02.0f" else "%04.1f", seconds)
        return if (includeSymbols) {
            "${degrees}° ${minutes}' ${secFormatted}\""
        } else {
            "${degrees}-${minutes}-${secFormatted}"
        }
    }

    companion object {
        val ZERO = DmsAngle(0, 0, 0.0)

        fun fromDecimal(decimal: Double): DmsAngle {
            var normalized = decimal % 360.0
            if (normalized < 0) normalized += 360.0
            val deg = floor(normalized).toInt()
            val remMin = (normalized - deg) * 60.0
            val min = floor(remMin).toInt()
            val sec = (remMin - min) * 60.0
            // Handle round off edge cases where sec rounds to 60
            val roundedSec = (sec * 10000.0).roundToLong() / 10000.0
            return if (roundedSec >= 60.0) {
                fromDecimal(deg + (min + 1) / 60.0)
            } else {
                DmsAngle(deg, min, roundedSec)
            }
        }

        fun fromRadians(rad: Double): DmsAngle {
            return fromDecimal(rad * 180.0 / PI)
        }

        fun parse(input: String): DmsAngle {
            val clean = input.trim()
            if (clean.isEmpty()) return ZERO

            // Check if standard decimal number
            clean.toDoubleOrNull()?.let {
                return fromDecimal(it)
            }

            // Replace standard DMS symbols (° ' ") with spaces or delimiters
            val sanitized = clean
                .replace("°", " ")
                .replace("'", " ")
                .replace("\"", " ")
                .replace("d", " ", ignoreCase = true)
                .replace("m", " ", ignoreCase = true)
                .replace("s", " ", ignoreCase = true)
                .replace(":", " ")
                .replace("-", " ")
                .trim()

            val parts = sanitized.split("\\s+".toRegex()).filter { it.isNotEmpty() }
            return try {
                when (parts.size) {
                    1 -> fromDecimal(parts[0].toDouble())
                    2 -> DmsAngle(parts[0].toInt(), parts[1].toInt(), 0.0)
                    3 -> DmsAngle(parts[0].toInt(), parts[1].toInt(), parts[2].toDouble())
                    else -> ZERO
                }
            } catch (e: Exception) {
                ZERO
            }
        }
    }
}
