CREATE PROCEDURE [dbo].[InsertRadnoVreme]
	@DanUNedelji int,
	@LokalID int,
	@VremeOtvaranja time,
	@VremeZatvaranja time
AS
begin
	insert into Radno_Vreme(dan_u_nedelji, lokal_id, vreme_otvaranja, vreme_zatvaranja)
	values (@DanUNedelji, @LokalID, @VremeOtvaranja, @VremeZatvaranja)
end