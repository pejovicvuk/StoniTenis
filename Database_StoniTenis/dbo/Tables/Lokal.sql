CREATE TABLE [dbo].[Lokal] (
    [id]               INT         IDENTITY (0, 1) NOT NULL,
    [klub_id]          INT         NOT NULL,
    [adresa]           NVARCHAR(MAX) NOT NULL,
    [kraj_rezervacija] DATE        NULL,
    [lokacija] NVARCHAR(MAX) NOT NULL, 
    CONSTRAINT [PK_4] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_2] FOREIGN KEY ([klub_id]) REFERENCES [dbo].[Klub] ([id])
);

