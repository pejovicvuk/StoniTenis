CREATE PROCEDURE [dbo].[InsertGrupnaRezervacija]
	@RezervacijaID int,
	@StoloviID bit
AS
begin
	insert into Grupne_Rezervacije(rezervacija_id, stolovi_id)
	values (@RezervacijaID, @StoloviID)
end

