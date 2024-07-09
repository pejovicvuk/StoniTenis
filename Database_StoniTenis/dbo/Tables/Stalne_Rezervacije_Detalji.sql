CREATE TABLE [dbo].[Stalne_Rezervacije_Detalji] (
    [Stalne_Rezervacije_id] INT      NOT NULL,
    [dan_u_nedelji]         INT      NOT NULL,
    [pocetak]               TIME (7) NOT NULL,
    [kraj]                  TIME (7) NOT NULL,
    CONSTRAINT [PK_12] PRIMARY KEY CLUSTERED ([Stalne_Rezervacije_id] ASC, [dan_u_nedelji] ASC),
    CONSTRAINT [FK_12] FOREIGN KEY ([Stalne_Rezervacije_id]) REFERENCES [dbo].[Stalne_Rezervacije] ([id])
);

