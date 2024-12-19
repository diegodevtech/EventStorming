import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      active: entity.isActive(),
      street: entity.street,
      number: entity.number,
      zip: entity.zip,
      city: entity.city,
      rewardPoints: entity.rewardPoints,
    });
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update({
      name: entity.name,
      active: entity.isActive(),
      street: entity.street,
      number: entity.number,
      zip: entity.zip,
      city: entity.city,
      rewardPoints: entity.rewardPoints,
    },
    {
      where: {
        id: entity.id
      }
    }
  );
  }

  async find(id: string): Promise<Customer> {
    let customerModel;
    
    try{
      customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true
      });
    } catch (error) {
      throw new Error("Customer not found.");
    }

    const customer = new Customer(id, customerModel.name);

    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zip,
      customerModel.city
    )

    customer.setAddress(address);
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    throw new Error("Method not implemented");
  }
}