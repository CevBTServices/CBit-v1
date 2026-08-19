-- CreateTable
CREATE TABLE "Proje" (
    "id" UUID NOT NULL,
    "projeAdi" TEXT NOT NULL,
    "projeDetayi" TEXT,
    "projeResmi" TEXT,
    "beyazAlan" TEXT,
    "sertifikasyon" TEXT,
    "itGucu" TEXT,
    "toplamKuruluGuc" TEXT,
    "pue" TEXT,
    "projeSuresi" TEXT,
    "toplamInsaatAlani" TEXT,
    "durum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Haberler" (
    "id" UUID NOT NULL,
    "haberAdi" TEXT NOT NULL,
    "haberDetayi" TEXT NOT NULL,
    "haberResmi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Haberler_pkey" PRIMARY KEY ("id")
);
