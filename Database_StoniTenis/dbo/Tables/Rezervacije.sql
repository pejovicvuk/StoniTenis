CREATE TABLE [dbo].[Rezervacije] (
    [id]           INT      IDENTITY (0, 1) NOT NULL,
    [korisnici_id] INT      NOT NULL,
    [pocetak]      TIME (7) NOT NULL,
    [kraj]         TIME (7) NOT NULL,
    [datum]        DATE     NOT NULL,
    [stalna_rezervacija] BIT NOT NULL, 
    CONSTRAINT [PK_8] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_6] FOREIGN KEY ([korisnici_id]) REFERENCES [dbo].[Korisnici] ([id])
);

