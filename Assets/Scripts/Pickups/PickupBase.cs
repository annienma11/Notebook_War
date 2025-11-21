using UnityEngine;

namespace NotebookWar.Pickups
{
    public abstract class PickupBase : MonoBehaviour
    {
        [Header("Pickup Settings")]
        [SerializeField] protected float rotationSpeed = 90f;
        [SerializeField] protected float bobSpeed = 2f;
        [SerializeField] protected float bobHeight = 0.5f;
        [SerializeField] protected GameObject pickupEffect;
        [SerializeField] protected AudioClip pickupSound;
        
        protected Vector3 startPosition;
        protected bool isCollected = false;

        protected virtual void Start()
        {
            startPosition = transform.position;
        }

        protected virtual void Update()
        {
            if (isCollected) return;

            // Rotate the pickup
            transform.Rotate(0, rotationSpeed * Time.deltaTime, 0);
            
            // Bob up and down
            float newY = startPosition.y + Mathf.Sin(Time.time * bobSpeed) * bobHeight;
            transform.position = new Vector3(transform.position.x, newY, transform.position.z);
        }

        protected virtual void OnTriggerEnter(Collider other)
        {
            if (isCollected) return;

            if (other.CompareTag("Player"))
            {
                if (CanPickup(other.gameObject))
                {
                    Collect(other.gameObject);
                }
            }
        }

        protected virtual bool CanPickup(GameObject player)
        {
            return true; // Override in derived classes for specific conditions
        }

        protected virtual void Collect(GameObject player)
        {
            isCollected = true;
            
            // Apply pickup effect
            ApplyEffect(player);
            
            // Show visual effect
            if (pickupEffect != null)
            {
                Instantiate(pickupEffect, transform.position, Quaternion.identity);
            }
            
            // Play sound effect
            if (pickupSound != null)
            {
                AudioSource.PlayClipAtPoint(pickupSound, transform.position);
            }
            
            // Destroy the pickup
            Destroy(gameObject);
        }

        protected abstract void ApplyEffect(GameObject player);
    }
}