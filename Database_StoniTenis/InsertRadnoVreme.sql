CREATE PROCEDURE [dbo].[InsertRadnoVreme]
    @DanUNedelji int,
    @LokalID int,
    @VremeOtvaranja time,
    @VremeZatvaranja time
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Radno_Vreme WHERE dan_u_nedelji = @DanUNedelji AND lokal_id = @LokalID)
    BEGIN
        UPDATE Radno_Vreme
        SET vreme_otvaranja = @VremeOtvaranja, vreme_zatvaranja = @VremeZatvaranja
        WHERE dan_u_nedelji = @DanUNedelji AND lokal_id = @LokalID;
    END
    ELSE
    BEGIN
        INSERT INTO Radno_Vreme(dan_u_nedelji, lokal_id, vreme_otvaranja, vreme_zatvaranja)
        VALUES (@DanUNedelji, @LokalID, @VremeOtvaranja, @VremeZatvaranja);
    END
END;
