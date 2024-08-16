import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {Token} from "./token.model"

@Entity_()
export class Holder {
    constructor(props?: Partial<Holder>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    token!: string

    @StringColumn_({nullable: false})
    address!: string

    @BigIntColumn_({nullable: false})
    balance!: bigint

    @Index_()
    @ManyToOne_(() => Token, {nullable: true})
    tokenEntity!: Token
}
