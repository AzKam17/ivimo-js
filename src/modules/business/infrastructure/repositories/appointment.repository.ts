import { BaseRepository } from "@/core/infrastructure/repositories";
import { Appointment } from "@/modules/business/infrastructure/entities";

export class AppointmentRepository extends BaseRepository<Appointment> {
  private static instance: AppointmentRepository;

  private constructor() {
    super(Appointment);
  }

  public static getInstance(): AppointmentRepository {
    if (!AppointmentRepository.instance) {
      AppointmentRepository.instance = new AppointmentRepository();
    }
    return AppointmentRepository.instance;
  }
}
