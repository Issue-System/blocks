/** @module @airtable/blocks/models: Abstract models */ /** */
import {invariant, spawnAbstractMethodError, spawnError} from '../error_utils';
import {BaseData} from '../types/base';
import Watchable from '../watchable';

/**
 * Abstract superclass for all models. You won't use this class directly.
 *
 * @docsPath models/advanced/AbstractModel
 */
class AbstractModel<DataType, WatchableKey extends string> extends Watchable<WatchableKey> {
    /** @internal */
    static _className = 'AbstractModel';
    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return false;
    }
    /** @internal */
    _baseData: BaseData;
    /** @internal */
    _id: string;
    /**
     * @internal
     */
    constructor(baseData: BaseData, modelId: string) {
        super();

        invariant(
            typeof modelId === 'string',
            '%s id should be a string',
            (this.constructor as typeof AbstractModel)._className,
        );

        this._baseData = baseData;
        this._id = modelId;
    }
    /**
     * The ID for this model.
     */
    get id(): string {
        return this._id;
    }
    /**
     * @internal
     */
    get _dataOrNullIfDeleted(): DataType | null {
        throw spawnAbstractMethodError();
    }
    /**
     * @internal
     */
    get _data(): DataType {
        const data = this._dataOrNullIfDeleted;
        if (data === null) {
            throw this._spawnErrorForDeletion();
        }
        return data;
    }
    /**
     * `true` if the model has been deleted, and `false` otherwise.
     *
     * In general, it's best to avoid keeping a reference to an object past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted object (other than its ID) will throw. But if you keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * model's data.
     */
    get isDeleted(): boolean {
        return this._dataOrNullIfDeleted === null;
    }
    /**
     * @internal
     */
    get __baseData(): BaseData {
        return this._baseData;
    }
    /**
     * @internal
     */
    _spawnErrorForDeletion(): Error {
        return spawnError(
            '%s has been deleted',
            (this.constructor as typeof AbstractModel)._className,
        );
    }
    /**
     * A string representation of the model for use in debugging.
     */
    toString(): string {
        return `[${(this.constructor as typeof AbstractModel)._className} ${this.id}]`;
    }
}

export default AbstractModel;
