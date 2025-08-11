import { BaseRepository } from "@/core/infrastructure/repositories";
import { Announcement } from "../entities";
import { BaseError } from "@/core/base/errors";

export class AnnouncementRepository extends BaseRepository<Announcement> {
  private static instance: AnnouncementRepository;

  private constructor() {
    super(Announcement);
  }

  public static getInstance(): AnnouncementRepository {
    if (!AnnouncementRepository.instance) {
      AnnouncementRepository.instance = new AnnouncementRepository();
    }
    return AnnouncementRepository.instance;
  }

  public async findAllByPaginate(params: { companyId: string , page?: number, limit?: number }): Promise<{ item: Announcement[]; total: number; limit: number; page: number; pageCount?: number }> {
    return await AnnouncementRepository.getInstance().findAllManyWithPagination({
      where: { companyId: params.companyId },
      page: params?.page,
      limit: params?.limit
    });

  }

  public async activeAnnouncement(id: string): Promise<Announcement> {
    const repository = AnnouncementRepository.getInstance();
    console.log('active id announcement => ', id);

    const announcement = await this.findAnnouncement(repository, id);
    announcement.isActive = true;
    console.log('active announcement => ', announcement);

    const updatedAnnouncement = await this.updateAnnounce(repository, announcement);

    return announcement;

  }

  public async diseableAnnouncement(id: string): Promise<Announcement> {
    const repository = AnnouncementRepository.getInstance();

    const announcement = await this.findAnnouncement(repository, id);
    announcement.isActive = false;

    console.log('diseable announcement => ', announcement)

    const updatedAnnouncement = await this.updateAnnounce(repository, announcement);

    return updatedAnnouncement;
  }

  public async createAnnouncement (data: Announcement):Promise<Announcement> {
    const announcement: Announcement = Announcement.create(data);
    console.log('repo announ :=> ', announcement)
    return await AnnouncementRepository.getInstance().save(announcement);
  }

  public async updateAnnouncement(announcement: Announcement): Promise<Announcement> {
    const repository = AnnouncementRepository.getInstance();

    const announcementUpdate = await this.findAnnouncement(repository, announcement.id);

    // Met à jour toutes les propriétés sauf id et champs système
    announcementUpdate.title = announcement.title ?? announcementUpdate.title;
    announcementUpdate.description = announcement.description ?? announcementUpdate.description;
    announcementUpdate.status = announcement.status ?? announcementUpdate.status;
    announcementUpdate.type = announcement.type ?? announcementUpdate.type;
    announcementUpdate.target = announcement.target ?? announcementUpdate.target;
    announcementUpdate.price = announcement.price ?? announcementUpdate.price;
    announcementUpdate.expiryDate = announcement.expiryDate ?? announcementUpdate.expiryDate;
    announcementUpdate.companyId = announcement.companyId ?? announcementUpdate.companyId;
    announcementUpdate.createdBy = announcement.createdBy ?? announcementUpdate.createdBy;
    announcementUpdate.propertyId = announcement.propertyId ?? announcementUpdate.propertyId;
    // Les champs système (id, createdAt, updatedAt, deletedAt, isActive) ne sont pas écrasés ici

    return await this.updateAnnounce(repository, announcementUpdate)

  }

  public async updateAnnounce(repository: AnnouncementRepository, announcement: Announcement) {
    const updatedAnnouncement = await repository.save(announcement);

    console.log(updatedAnnouncement)

    if (!updatedAnnouncement) {
      throw new BaseError({
        message: "Failed to update Announcement",
        statusCode: 500,
      });
    }
    return updatedAnnouncement;
  }

  public async findAnnouncement(repository: AnnouncementRepository, id: string) {
    const announcement = await repository.findOneByWhithoutParamIsActive({ id }, true);

    if (!announcement) {
      throw new BaseError({
        message: "announcement not found",
        statusCode: 404,
      });
    }
    return announcement;
  }

  public async delectAnnouncement (id: string) {
    const repository = AnnouncementRepository.getInstance();
    const announcement = await this.findAnnouncement(repository, id);

    return await repository.delete(id);
  }

}
