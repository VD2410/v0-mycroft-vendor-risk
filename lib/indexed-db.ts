// IndexedDB helper for storing large files
const DB_NAME = 'VendorRiskDB'
const STORE_NAME = 'pendingFiles'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        }
    })
}

export async function saveFile(userId: string, file: File): Promise<void> {
    const db = await openDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put(file, `pending_file_${userId}`)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => db.close()
    })
}

export async function getFile(userId: string): Promise<File | null> {
    const db = await openDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get(`pending_file_${userId}`)

        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => db.close()
    })
}

export async function deleteFile(userId: string): Promise<void> {
    const db = await openDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete(`pending_file_${userId}`)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => db.close()
    })
}
