CREATE TABLE [dbo].[Stalne_Rezervacije] (
    [id]           INT  IDENTITY (0, 1) NOT NULL,
    [korisnici_id] INT  NOT NULL,
    [datum_od]     DATE NOT NULL,
    [datum_do]     DATE NULL,
    CONSTRAINT [PK_10] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_9] FOREIGN KEY ([korisnici_id]) REFERENCES [dbo].[Korisnici] ([id])
);

