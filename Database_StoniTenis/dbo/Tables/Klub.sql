CREATE TABLE [dbo].[Klub] (
    [id]         INT         IDENTITY (0, 1) NOT NULL,
    [vlasnik_id] INT         NOT NULL,
    [Naziv]      VARCHAR (1) NOT NULL,
    CONSTRAINT [PK_3] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_1] FOREIGN KEY ([vlasnik_id]) REFERENCES [dbo].[Vlasnici] ([id])
);

