CREATE TABLE [dbo].[Radno_Vreme] (
    [dan_u_nedelji]    INT      NOT NULL,
    [lokal_id]         INT      NOT NULL,
    [vreme_otvaranja]  TIME (0) NOT NULL,
    [vreme_zatvaranja] TIME (0) NOT NULL,
    [efektivan_datum]  DATE     NOT NULL,
    CONSTRAINT [PK_5] PRIMARY KEY CLUSTERED ([dan_u_nedelji] ASC, [lokal_id] ASC),
    CONSTRAINT [FK_3] FOREIGN KEY ([lokal_id]) REFERENCES [dbo].[Lokal] ([id]),
    CONSTRAINT [CK_dan_u_nedelji] CHECK ([dan_u_nedelji] BETWEEN 1 AND 7)
);

