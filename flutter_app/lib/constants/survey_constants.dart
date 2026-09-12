/// Exact cadastral and survey constants specified for the application
class SurveyConstants {
  // Bigha System (Terai Region):
  // 1 Bigha = 20 Kattha = 6772.63 sq.m = 72900 sq.ft.
  // 1 Kattha = 20 Dhur = 338.63 sq.m = 3645 sq.ft.
  // 1 Dhur = 16.93 sq.m = 182.25 sq.ft.
  static const double sqftPerBigha = 72900.0;
  static const double sqftPerKattha = 3645.0;
  static const double sqftPerDhur = 182.25;

  static const double sqmPerBigha = 6772.63;
  static const double sqmPerKattha = 338.63;
  static const double sqmPerDhur = 16.93;

  static const int katthaPerBigha = 20;
  static const int dhurPerKattha = 20;

  // Ropani System (Hilly Region):
  // 1 Ropani = 16 Aana = 508.72 sq.m = 5476 sq.ft.
  // 1 Aana = 4 Paisa = 31.80 sq.m = 342.25 sq.ft.
  // 1 Paisa = 4 Daam = 7.95 sq.m = 85.56 sq.ft.
  // 1 Daam = 1.99 sq.m = 21.39 sq.ft.
  static const double sqftPerRopani = 5476.0;
  static const double sqftPerAana = 342.25;
  static const double sqftPerPaisa = 85.56;
  static const double sqftPerDaam = 21.39;

  static const double sqmPerRopani = 508.72;
  static const double sqmPerAana = 31.80;
  static const double sqmPerPaisa = 7.95;
  static const double sqmPerDaam = 1.99;

  static const int aanaPerRopani = 16;
  static const int paisaPerAana = 4;
  static const int daamPerPaisa = 4;

  // General Interconversions:
  // 1 Ropani ≈ 0.0752 Bigha | 1 Bigha ≈ 13.31 Ropani | 1 sq.m ≈ 10.7639 sq.ft.
  static const double ropaniToBigha = 0.0752;
  static const double bighaToRopani = 13.31;
  static const double sqmToSqft = 10.7639;
  static const double sqftToSqm = 1.0 / 10.7639;

  // Additional Surveying Area Units
  static const double sqftPerAcre = 43560.0;
  static const double sqmPerHectare = 10000.0;

  // Angular constants:
  // 400g = 360° = 24 hrs = 2π rad = 6400 mils
  static const double gradsPerCircle = 400.0;
  static const double degreesPerCircle = 360.0;
  static const double hoursPerCircle = 24.0;
  static const double milsPerCircle = 6400.0;
}
