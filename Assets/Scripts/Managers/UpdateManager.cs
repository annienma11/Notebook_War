using System.Collections.Generic;
using UnityEngine;

namespace NotebookWar.Managers
{
    public interface IUpdatable
    {
        void OnUpdate(float deltaTime);
    }

    public class UpdateManager : MonoBehaviour
    {
        private static UpdateManager instance;
        public static UpdateManager Instance
        {
            get
            {
                if (instance == null)
                {
                    GameObject go = new GameObject("UpdateManager");
                    instance = go.AddComponent<UpdateManager>();
                    DontDestroyOnLoad(go);
                }
                return instance;
            }
        }

        private List<IUpdatable> updatables = new List<IUpdatable>();

        private void Update()
        {
            float deltaTime = Time.deltaTime;
            for (int i = 0; i < updatables.Count; i++)
            {
                updatables[i].OnUpdate(deltaTime);
            }
        }

        public void Register(IUpdatable updatable)
        {
            if (!updatables.Contains(updatable))
                updatables.Add(updatable);
        }

        public void Unregister(IUpdatable updatable)
        {
            updatables.Remove(updatable);
        }
    }
}
