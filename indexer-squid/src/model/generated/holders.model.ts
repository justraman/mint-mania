import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Tokens} from "./tokens.model"

@Entity_()
export class Holders {
    constructor(props?: Partial<Holders>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Tokens, {nullable: true})
    token!: Tokens

    @StringColumn_({nullable: false})
    address!: string

    @BigIntColumn_({nullable: false})
    balance!: bigint
}
