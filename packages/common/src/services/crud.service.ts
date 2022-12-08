import { HttpException, HttpStatus } from '@nestjs/common';
import { validate, ValidatorOptions } from 'class-validator';
import { DeepPartial, Repository } from 'typeorm';

import { BaseEntity } from '../entities/base';

export class CrudService<T extends BaseEntity> {
  protected repository?: Repository<T>;

  constructor(repository?: Repository<T>) {
    if (repository) {
      this.repository = repository;
    }
  }

  get repo() {
    return this.repository;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    const entity: T = this.repository.create(data);

    await this.validate(entity, {
      groups: ['save'],
    });

    return this.repository.save(data);
  }

  protected async validate(entity: T, options?: ValidatorOptions) {
    const errors = await validate(entity, {
      validationError: {
        target: false,
        value: false,
      },
      options,
    } as ValidatorOptions);

    if (errors.length > 0) {
      throw new HttpException(
        { message: errors, error: 'Validation' },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}
