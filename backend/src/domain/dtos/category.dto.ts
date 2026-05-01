import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateCategoryInput {
  constructor(name: string) {
    this.name = name
  }

  @Field(() => String)
  name: string
}

@InputType()
export class UpdateCategoryInput {
  constructor(name: string) {
    this.name = name
  }

  @Field(() => String)
  name: string
}
