using System.Collections.Generic;
using UnityEngine;

namespace NotebookWar.Pooling
{
    public class ObjectPool : MonoBehaviour
    {
        [SerializeField] private GameObject prefab;
        [SerializeField] private int initialSize = 20;
        [SerializeField] private bool expandable = true;

        private Queue<GameObject> pool = new Queue<GameObject>();
        private List<GameObject> activeObjects = new List<GameObject>();

        private void Awake()
        {
            for (int i = 0; i < initialSize; i++)
            {
                CreateNewObject();
            }
        }

        private GameObject CreateNewObject()
        {
            GameObject obj = Instantiate(prefab, transform);
            obj.SetActive(false);
            pool.Enqueue(obj);
            return obj;
        }

        public GameObject Get(Vector3 position, Quaternion rotation)
        {
            GameObject obj;

            if (pool.Count > 0)
            {
                obj = pool.Dequeue();
            }
            else if (expandable)
            {
                obj = CreateNewObject();
                pool.Dequeue();
            }
            else
            {
                return null;
            }

            obj.transform.position = position;
            obj.transform.rotation = rotation;
            obj.SetActive(true);
            activeObjects.Add(obj);
            return obj;
        }

        public void Return(GameObject obj)
        {
            obj.SetActive(false);
            activeObjects.Remove(obj);
            pool.Enqueue(obj);
        }

        public void ReturnAll()
        {
            for (int i = activeObjects.Count - 1; i >= 0; i--)
            {
                Return(activeObjects[i]);
            }
        }
    }
}
