CREATE TABLE [dbo].[Radno_Vreme] (
    [dan_u_nedelji]    INT      NOT NULL,
    [lokal_id]         INT      NOT NULL,
    [vreme_otvaranja]  TIME (7) NOT NULL,
    [vreme_zatvaranja] TIME (7) NOT NULL,
    [efektivan_datum]  DATE     NULL,
    CONSTRAINT [PK_5] PRIMARY KEY CLUSTERED ([dan_u_nedelji] ASC, [lokal_id] ASC),
    CONSTRAINT [FK_3] FOREIGN KEY ([lokal_id]) REFERENCES [dbo].[Lokal] ([id])
);

