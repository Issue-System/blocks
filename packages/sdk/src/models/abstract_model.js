// @flow
import {invariant, spawnAbstractMethodError, spawnError} from '../error_utils';
import {type BaseData} from '../types/base';
import Watchable from '../watchable';

/**
 * Abstract superclass for all models. You won't use this class directly.
 */
class AbstractModel<DataType, WatchableKey: string> extends Watchable<WatchableKey> {
    static _className = 'AbstractModel';
    static _isWatchableKey(key: string): boolean {
        return false;
    }
    _baseData: BaseData;
    _id: string;
    /**
     * @hideconstructor
     */
    constructor(baseData: BaseData, modelId: string) {
        super();

        invariant(
            typeof modelId === 'string',
            '%s id should be a string',
            this.constructor._className,
        );

        this._baseData = baseData;
        this._id = modelId;
    }
    /**
     * @function
     * @returns The ID for this model.
     */
    get id(): string {
        return this._id;
    }
    /**
     * @private
     */
    get _dataOrNullIfDeleted(): DataType | null {
        throw spawnAbstractMethodError();
    }
    /**
     * @private
     */
    get _data(): DataType {
        const data = this._dataOrNullIfDeleted;
        if (data === null) {
            throw this._spawnErrorForDeletion();
        }
        return data;
    }
    /**
     * A boolean denoting whether the model has been deleted.
     *
     * In general, it's best to avoid keeping a reference to an object past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted object (other than its ID) will throw. But if you keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * model's data.
     *
     * @function
     * @returns `true` if the model has been deleted, and `false` otherwise.
     */
    get isDeleted(): boolean {
        return this._dataOrNullIfDeleted === null;
    }
    /**
     * @private
     */
    get __baseData(): BaseData {
        return this._baseData;
    }
    /**
     * @private
     */
    _spawnErrorForDeletion(): Error {
        return spawnError('%s has been deleted', this.constructor._className);
    }
    /**
     * @returns A string representation of the model for use in debugging.
     */
    toString(): string {
        return `[${this.constructor._className} ${this.id}]`;
    }
}

export default AbstractModel;