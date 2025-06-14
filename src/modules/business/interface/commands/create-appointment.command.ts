import { BaseCommand, BaseCommandHandler, CommandProps } from "@/core/base/classes";
import { BaseError } from "@/core/base/errors";
import { UserRepository } from "@/modules/auth/infrastructure/repositories/user.repository";
import { Appointment } from "@/modules/business/infrastructure/entities";
import { AppointmentRepository } from "@/modules/business/infrastructure/repositories";
import { PropertyRepository } from "@/modules/property/infrastructure/repositories";
import moment from "moment";

export class CreateAppointmentCommand extends BaseCommand {
  start_date: string;
  end_date: string;
  property_id: string;
  agent_id: string;
  client_id?: string;
  created_by?: string;
  extras?: Record<string, any>;
  constructor(props: CommandProps<CreateAppointmentCommand>) {
    super(props);
    this.start_date = props.start_date;
    this.end_date = props.end_date;
    this.property_id = props.property_id;
    this.agent_id = props.agent_id;
    this.client_id = props.client_id;
    this.created_by = props.created_by;
    this.extras = props.extras;
  }
}

export class CreateAppointmentCommandHandler extends BaseCommandHandler<CreateAppointmentCommand, Appointment> {
  async execute(command: CreateAppointmentCommand): Promise<Appointment> {
    const repository = AppointmentRepository.getInstance();
    const propertyRepository = PropertyRepository.getInstance();
    const userRepository = UserRepository.getInstance();

    const property = await propertyRepository.findById(command.property_id);
    if (!property) {
      throw new BaseError({
        statusCode: 404,
        message: "Property not found",
      });
    }

    if (command.client_id) {
      await userRepository.exists({ id: command.client_id }, true);
    }

    const apptmt = Appointment.create({
      startDate: moment(command.start_date).toDate(),
      endDate: moment(command.end_date).toDate(),
      propertyId: command.property_id,
      agentId: property.ownedBy || property.createdBy,
      clientId: command.client_id,
      createdBy: command.client_id,
      extras: command.extras,
    });

    return await repository.save(apptmt);
  }
}
