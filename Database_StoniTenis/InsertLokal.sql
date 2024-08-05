CREATE PROCEDURE [dbo].[InsertLokal]
	@Klub_ID int,
	@Adresa varchar(max),
	@Opstina varchar(max),
	@Grad varchar(max)
AS
begin
	insert into Lokal(klub_id, adresa, opstina, grad)
	values (@Klub_ID, @Adresa, @Opstina, @Grad)
end