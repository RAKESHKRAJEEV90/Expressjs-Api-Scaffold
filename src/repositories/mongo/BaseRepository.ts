import { Model, Document, FilterQuery } from 'mongoose';
import { IRepository } from '../interfaces/IRepository';

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return entity.save();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    return this.model.findOne(filter as FilterQuery<T>);
  }

  async find(filter: Partial<T>): Promise<T[]> {
    return this.model.find(filter as FilterQuery<T>);
  }

  async exists(filter: Partial<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter as FilterQuery<T>);
    return count > 0;
  }

  async count(filter?: Partial<T>): Promise<number> {
    return this.model.countDocuments((filter || {}) as FilterQuery<T>);
  }
} 