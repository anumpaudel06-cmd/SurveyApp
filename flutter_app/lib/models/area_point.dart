class AreaPoint {
  final String id;
  final String label;
  final double x; // Easting
  final double y; // Northing

  AreaPoint({
    String? id,
    required this.label,
    required this.x,
    required this.y,
  }) : id = id ?? DateTime.now().microsecondsSinceEpoch.toString();
}

class LandAreaResult {
  final double sqMeters;
  final double sqFeet;
  final double perimeterMeters;
  final double perimeterFeet;

  // Bigha System
  final double decimalBigha;
  final int bighaInt;
  final int katthaInt;
  final double dhurDouble;
  final String bkdFormatted;

  // Ropani System
  final double decimalRopani;
  final int ropaniInt;
  final int aanaInt;
  final int paisaInt;
  final double daamDouble;
  final String rapdFormatted;

  // Metric / Imperial
  final double hectares;
  final double acres;

  const LandAreaResult({
    required this.sqMeters,
    required this.sqFeet,
    required this.perimeterMeters,
    required this.perimeterFeet,
    required this.decimalBigha,
    required this.bighaInt,
    required this.katthaInt,
    required this.dhurDouble,
    required this.bkdFormatted,
    required this.decimalRopani,
    required this.ropaniInt,
    required this.aanaInt,
    required this.paisaInt,
    required this.daamDouble,
    required this.rapdFormatted,
    required this.hectares,
    required this.acres,
  });
}
