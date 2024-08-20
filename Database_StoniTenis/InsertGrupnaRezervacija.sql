CREATE PROCEDURE [dbo].[InsertGrupnaRezervacija]
    @RezervacijaID INT,
    @BrojStola INT,
    @LokalID INT
AS
BEGIN
    DECLARE @StoloviID INT;

    SELECT @StoloviID = id
    FROM Stolovi
    WHERE broj_stola = @BrojStola AND lokal_id = @LokalID;

    INSERT INTO Grupne_Rezervacije (rezervacija_id, stolovi_id)
        VALUES (@RezervacijaID, @StoloviID);
END
