CREATE TABLE [dbo].[Stolovi] (
    [id]         INT IDENTITY (0, 1) NOT NULL,
    [lokal_id]   INT NOT NULL,
    [broj_stola] INT NOT NULL,
    CONSTRAINT [PK_7] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FK_5] FOREIGN KEY ([lokal_id]) REFERENCES [dbo].[Lokal] ([id])
);

