using UnityEngine;
using NotebookWar.Managers;

namespace NotebookWar.Level
{
    public class CheckpointTrigger : MonoBehaviour
    {
        [SerializeField] private int checkpointIndex;
        [SerializeField] private GameObject activationEffect;
        
        private bool isActivated = false;
        private LevelManager levelManager;

        private void Start()
        {
            levelManager = FindObjectOfType<LevelManager>();
        }

        private void OnTriggerEnter(Collider other)
        {
            if (isActivated) return;
            
            if (other.CompareTag("Player"))
            {
                ActivateCheckpoint();
            }
        }

        private void ActivateCheckpoint()
        {
            isActivated = true;
            
            if (levelManager != null)
                levelManager.ActivateCheckpoint(checkpointIndex);
            
            if (activationEffect != null)
            {
                GameObject effect = Instantiate(activationEffect, transform.position, Quaternion.identity);
                Destroy(effect, 2f);
            }
            
            Debug.Log($"Checkpoint {checkpointIndex} reached!");
        }
    }
}