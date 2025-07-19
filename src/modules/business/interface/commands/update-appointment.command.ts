import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { AppointmentStatus, UserRoleEnum } from "@/core/enums/enums";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { Appointment } from "@/modules/business/infrastructure/entities";
import { AppointmentRepository } from "@/modules/business/infrastructure/repositories";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";
import moment from "moment";

export class UpdateAppointmentCommand extends BaseCommand {
  id: string;
  user_id: string;
  start_date?: string;
  end_date?: string;
  status: AppointmentStatus;
  extras?: Record<string, any>;

  constructor(props: CommandProps<UpdateAppointmentCommand>) {
    super(props);
    this.id = props.id;
    this.user_id = props.user_id;
    this.start_date = props.start_date;
    this.end_date = props.end_date;
    this.status = props.status;
    this.extras = props.extras;
  }
}

export class UpdateAppointmentCommandHandler extends BaseCommandHandler<UpdateAppointmentCommand, Appointment> {
  async execute(command: UpdateAppointmentCommand): Promise<Appointment> {
    const repository = AppointmentRepository.getInstance();
    const propertyRepository = PropertyRepository.getInstance();
    const userRepository = UserRepository.getInstance();

    const apptmt = await repository.findById(command.id);
    if (!apptmt) {
      throw new BaseError({
        statusCode: 404,
        message: "Appointment not found",
      });
    }

    if (apptmt.agentId !== command.user_id || apptmt.createdBy !== command.user_id) {
      throw new BaseError({
        statusCode: 403,
        message: "You are not allowed to update this appointment",
      });
    }

    const payload: Partial<Appointment> = {};

    if (command.start_date) payload.startDate = moment(command.start_date).toDate();

    if (command.end_date) payload.endDate = moment(command.end_date).toDate();

    if (command.status) payload.status = command.status;

    if (command.extras) payload.extras = { ...apptmt.extras, ...command.extras };

    return (await repository.update(command.id, payload)) as Appointment;
  }
}
