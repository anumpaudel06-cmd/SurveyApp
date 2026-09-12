package com.example.model

data class AreaPoint(
    val id: String = java.util.UUID.randomUUID().toString(),
    val label: String,
    val x: Double, // Easting
    val y: Double  // Northing
)

data class LandAreaResult(
    val sqMeters: Double,
    val sqFeet: Double,
    val perimeterMeters: Double,
    val perimeterFeet: Double,
    // Bigha System
    val decimalBigha: Double,
    val bighaInt: Long,
    val katthaInt: Long,
    val dhurDouble: Double,
    val bkdFormatted: String,
    // Ropani System
    val decimalRopani: Double,
    val ropaniInt: Long,
    val aanaInt: Long,
    val paisaInt: Long,
    val daamDouble: Double,
    val rapdFormatted: String,
    // Metric / Imperial equivalents
    val hectares: Double,
    val acres: Double
)
