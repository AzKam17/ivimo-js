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

  public async findAllByPaginate(params: { data: Announcement, page?: number, limit?: number }): Promise<{ item: Announcement[]; total: number; limit: number; page: number; pageCount?: number }> {

    return await AnnouncementRepository.getInstance().findAllManyWithPagination({
      where: { companyId: params.data.companyId },
      page: params.page,
      limit: params.limit
    });

  }

  public async activeAnnouncement(id: string): Promise<Announcement> {
    const repository = AnnouncementRepository.getInstance();

    const announcement = await this.findAnnouncement(repository, id);

    announcement.isActive = true;

    const updatedAnnouncement = await this.updateAnnouncement(repository, announcement);

    return updatedAnnouncement;

  }

  public async diseableAnnouncement(id: string): Promise<Announcement> {
    const repository = AnnouncementRepository.getInstance();

    const announcement = await this.findAnnouncement(repository, id);

    announcement.isActive = false;

    const updatedAnnouncement = await this.updateAnnouncement(repository, announcement);

    return updatedAnnouncement;
  }

  public async updateAnnouncement(announcement: Announcement): Promise<any> {
    const repository = AnnouncementRepository.getInstance();

    const announcementFind = this.findAnnouncement(repository, announcement)

  }

  private async updateAnnouncement(repository: AnnouncementRepository, announcement: Announcement) {
    const updatedAnnouncement = await repository.update(announcement.id, announcement);

    if (!updatedAnnouncement) {
      throw new BaseError({
        message: "Failed to update Announcement",
        statusCode: 500,
      });
    }
    return updatedAnnouncement;
  }

  private async findAnnouncement(repository: AnnouncementRepository, id: string) {
    const announcement = await repository.findOneByWhithoutParamIsActive({ id }, true);

    if (!announcement) {
      throw new BaseError({
        message: "announcement not found",
        statusCode: 404,
      });
    }
    return announcement;
  }

}
